const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    userName: String,
    Password: String
});

var User = mongoose.model('User', userSchema , 'Users');

module.exports = User;