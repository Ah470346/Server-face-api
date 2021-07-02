const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    userName: String,
    password: String
});

var User = mongoose.model('User', userSchema , 'Users');

module.exports = User;