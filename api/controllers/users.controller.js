const User = require('../../models/Users.model');

module.exports.getUser = async (req,res,next)=>{
    User.find().then((users)=> res.json(users));
};
