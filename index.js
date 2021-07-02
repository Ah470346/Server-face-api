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

// use Router
app.use('/api/auth', apiAuthRouter);
app.use('/api/recognitions', apiRecognitionRouter);
app.use('/api/users', apiUsersRouter);
app.use('/api/channels', apiChannelRouter);

//---------------------------------------------------------------------------------socket
const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true
    }
  }); // < Interesting!
// let uri = 'rtsp://admin:abcd1234@192.168.0.22:554';

let arrStream = [];

const checkStream = (uri)=>{
  for(let i of arrStream){
    if(i.uri === uri){
      return i.stream
    }
  }
  return false;
}



const runSocket = (uri)=>{
    let stream = new rtsp.FFMpeg({input: uri , rate: 20 });
      io.sockets.on("connection", (socket) => {
        let pipeStream = function(data) {
            socket.emit('data', data.toString('base64'));
        };
        stream.on('data', pipeStream);
        socket.on('disconnect', function() {
          stream.removeListener('data', pipeStream);
        });
      });
    // if(arrStream.length === 0){
    //   console.log("1");
    //   let stream = new rtsp.FFMpeg({input: uri , rate: 20 });
    //   io.sockets.on("connection", (socket) => {
    //     let pipeStream = function(data) {
    //         socket.emit('data', data.toString('base64'));
    //     };
    //     stream.on('data', pipeStream);
    //     socket.on('disconnect', function() {
    //       stream.removeListener('data', pipeStream);
    //     });
    //     arrStream.push({stream:stream,uri:uri});
    //   });
    // } else if(checkStream(uri)===false){
    //   console.log("2");
    //   let stream = new rtsp.FFMpeg({input: uri , rate: 20 });
    //   io.sockets.on("connection", (socket) => {
    //     let pipeStream = function(data) {
    //         socket.emit('data', data.toString('base64'));
    //     };
    //     stream.on('data', pipeStream);
    //     socket.on('disconnect', function() {
    //       stream.removeListener('data', pipeStream);
    //     });
    //     arrStream.push({stream:stream,uri:uri});
    //   });
    // } else {
    //   console.log("3");
    //   let stream = checkStream(uri);
    //   io.sockets.on("connection", (socket) => {
    //     let pipeStream = function(data) {
    //         socket.emit('data', data.toString('base64'));
    //     };
    //     stream.on('data', pipeStream);
    //     socket.on('disconnect', function() {
    //       stream.removeListener('data', pipeStream);
    //     });
    //     arrStream.push({stream:stream,uri:uri});
    //   });
    // }
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

