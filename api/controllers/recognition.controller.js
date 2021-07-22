const Recognition = require('../../models/recognitions.model');

const compare = (arr1,arr2)=>{
    if(arr1.length === arr2.length){
        let test;
        for(let i = 0 ; i< arr1.length ; i++){
            test = arr1[i].every((value,index)=> {return value !== arr2[i][index]});
        }
        if(test === true){
            return true;
        }
    }
    return false
    
}

module.exports.getRecognition = async (req,res,next)=>{
    Recognition.find().then((rects)=> res.json(rects));
};

module.exports.postRecognition =(req,res,next) => {
    Recognition.find().then(async (rects)=> {
        let check = false;
        for(let i of rects){
            if(i.label === req.body.label && i.ChannelName === req.body.ChannelName ){
                check = true;
                break;
            }
        }
        if(check === false && req.body.faceDetects.length !==0){
            var Rect = await Recognition.create(req.body);
            res.json(Rect); 
        } else if(check === true && req.body.faceDetects.length !==0){
            var Rect = await Recognition.findOneAndReplace({label:req.body.label,ChannelName:req.body.ChannelName},req.body)
            res.json(Rect); 
        } else {
            res.json(Rect);     
        }
    });
};

module.exports.editActiveRecognition = async (req,res,next)=>{
    const Rect = await Recognition.updateOne({label:req.body.label,ChannelName:req.body.ChannelName}, { Active: req.body.Active});
    if(Rect){
        Recognition.find({label:req.body.label,ChannelName:req.body.ChannelName}).then((rec)=>{
            res.json(rec); 
        })
    }
}

module.exports.deleteRecognition = async (req,res,next)=>{
    const Rect = await Recognition.updateOne({label:req.body.label,ChannelName:req.body.ChannelName}, { isDelete: req.body.isDelete});
    res.json(Rect); 
}

module.exports.cloneRecognition =(req,res,next)=>{
    Recognition.find({ChannelName:req.body.ToChannel}).then(async(rects)=>{
        for(let i of req.body.label){
            let exist = false;
            for(let j of rects){
                if(i === j.label && j.isDelete !== true){
                    exist = true;
                }
            }
            if(exist === false){
                Recognition.find({label:i,ChannelName:req.body.FromChannel}).then( async (rect)=> {
                    const Rect = await Recognition.create({faceDetects:rect[0].faceDetects,
                                                            label:rect[0].label,
                                                            faceID:rect[0].faceID,
                                                            Time:rect[0].Time,
                                                            ChannelName:req.body.ToChannel,
                                                            Active:rect[0].Active,
                                                            isDelete:rect[0].isDelete});
                });
            }
        }
    })
    res.json("done");
}

module.exports.moveRecognition = (req,res,next)=>{
    Recognition.find({ChannelName:req.body.ToChannel}).then(async(rects)=>{
        for(let i of req.body.label){
            let exist = false;
            for(let j of rects){
                if(i === j.label){
                    exist = true;
                }
            }
            if(exist === false){
                console.log("hello");
                const Rect = await Recognition.updateOne({label:i,ChannelName:req.body.FromChannel}, { ChannelName: req.body.ToChannel}); 
            } else if(exist === true){
                const Rect = await Recognition.deleteOne({label:i,ChannelName:req.body.FromChannel});
            }
            
        }
    })
    res.json("done");
}

module.exports.uploadRecognition = async(req,res,next)=>{
    const path = req.file.path.split("\\").slice(1).join("/");
    const Rect = await Recognition.updateOne({label:req.body.name,ChannelName:req.body.ChannelName}, { image: path});
    res.json("oke");
}