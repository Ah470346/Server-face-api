const User = require('../../models/Users.model');

module.exports.postAuth = async (req,res,next)=>{
    User.find({userName: req.body.username}).then((user)=> {
        if(user.length===0){
            res.status(401).send({message: "Tài khoản không tồn tại"});
        } else {
            if(user[0].password !== req.body.password){
                res.status(401).send({message: "Mật khẩu không chính xác"});
            } else {
                res.status(200).send(user[0].userName);
            }
        }
    });
};