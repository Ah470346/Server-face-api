const mongoose = require('mongoose');

var channel = new mongoose.Schema({
    ChannelName:String,
    CameraIP: String,
    OfficeName:String
});

var Channel = mongoose.model('Channel', channel , 'Channels');

module.exports = Channel;