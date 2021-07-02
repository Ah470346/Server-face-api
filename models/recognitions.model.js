const mongoose = require('mongoose');

var recognitionsSchema = new mongoose.Schema({
    faceID:String,
    label: String,
    faceDetects:[[String]],
    ChannelName:String
});

var Recognition = mongoose.model('Recognition', recognitionsSchema , 'Recognitions');

module.exports = Recognition;