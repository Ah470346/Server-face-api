const express = require('express');
const mongoose = require('mongoose');
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const rtsp = require('rtsp-ffmpeg');
const http = require("http");
const socketIo = require("socket.io");

require('dotenv').config();

var dir = path.join(__dirname, 'public');

const app = express();
const port = 8080;


mongoose.connect(process.env.MONGO_URL,{useNewUrlParser: true, useUnifiedTopology: true});

const apiRecognitionRouter = require('./api/routers/recognition.router');
const apiUsersRouter = require('./api/routers/user.router');
const apiAuthRouter = require('./api/routers/authentication.router');
const apiChannelRouter = require('./api/routers/channel.router');
const { Socket } = require('net');

app.use(cors({
    credentials:true, origin: "http://localhost:3000"
}));

//use middleware import
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(function(req, res, next) {
    res.header('Content-Type', 'application/json;charset=UTF-8');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

let a = 1;

checkDataChange = (req,res,next) => {
  a = ++a;
  next();
};

// use Router
app.use('/api/auth', apiAuthRouter);
app.use('/api/recognitions', checkDataChange,apiRecognitionRouter);
app.use('/api/users', apiUsersRouter);
app.use('/api/channels', apiChannelRouter);

//---------------------------------------------------------------------------------socket
const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
      origin: "http://192.168.1.62:3000",
      credentials: true
    }
  }); // < Interesting!

let streamArray = [];
const check = (streamArray,uri) =>{
  for(let i of streamArray){
    if(i.input === uri){
      return {isCheck: true, index: streamArray.indexOf(i)};
    }
  }
  return {isCheck: false, index: 0};
}

const runSocket = (uri)=>{
  let stream;
  if(streamArray.length !==0 && check(streamArray,uri).isCheck === false){
    stream = new rtsp.FFMpeg({input: uri , rate: 20 });
    streamArray.push(stream);
  } else if(streamArray.length === 0) {
    stream = new rtsp.FFMpeg({input: uri , rate: 20 });
    streamArray.push(stream);
  } else {
    stream = streamArray[check(streamArray,uri).index];
  }
  io.sockets.on("connection", (socket) => {
    let pipeStream = function(data) {
        socket.emit('data',{data:data.toString('base64'),a:a});
    };
    stream.on('data', pipeStream);
    socket.on('disconnect', function() {
      stream.removeListener('data', pipeStream);
    });
  });
};

app.get("/", (req, res) => {
    res.send({ response: "I am alive" }).status(200);
  });

app.post("/", (req, res) => {
    if(req.body !== undefined){
      io.removeAllListeners();
      runSocket(req.body.uri);
    }
    res.send('post').status(200);
});


server.listen(port, () => console.log(`Listening on port ${port}`));

