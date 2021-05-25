const express = require('express');
const mongoose = require('mongoose');
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');

require('dotenv').config();

var dir = path.join(__dirname, 'public');

const app = express();
const port = 8080;

mongoose.connect(process.env.MONGO_URL,{useNewUrlParser: true, useUnifiedTopology: true});

const apiRecognitionRouter = require('./api/routers/recognition.router');
const apiUsersRouter = require('./api/routers/user.router');

app.use(cors({
    credentials:true, origin: "http://127.0.0.1:3000"
}));

//use middleware import
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(function(req, res, next) {
    res.header('Content-Type', 'application/json;charset=UTF-8');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:3000')
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

// use Router
app.use('/api/recognitions', apiRecognitionRouter);
app.use('/api/users', apiUsersRouter);

app.get('/', (req,res) =>{
    res.send('hello');
});

// listening
app.listen(port,()=>{
    console.log('server listening on port '+ port );
});


