const Channel = require('../../models/channels.model');
const Recognition = require('../../models/recognitions.model');


module.exports.getChannel = (req,res,next)=>{
    Channel.find().then((channels)=> res.json(channels));
};

module.exports.postChannel =(req,res,next) => {
    Channel.create(req.body).then((chan)=>{
        res.json(chan);
    })    
};

module.exports.editChannel =async (req,res,next) => {
    const response =  await Channel.replaceOne({ChannelName:req.body.condition}, req.body.channel);
    const result = await Recognition.updateMany({ ChannelName:req.body.condition}, { ChannelName: req.body.channel.ChannelName });
    res.json(response);
};

module.exports.deleteChannel =async(req,res,next) => {
    const response = await Channel.deleteOne({ChannelName:req.body.ChannelName}); 
    res.json(response);
};