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
            if(i.label === req.body.label){
                check = true;
                break;
            }
        }
        if(check === false){
            var Rect = await Recognition.create(req.body);
            res.json(Rect); 
        } else {
            var Rect = await Recognition.findOneAndReplace({label:req.body.label},req.body)
            res.json(Rect); 
        }
    });
};