const jwt = require('jsonwebtoken');
const blacklistModel = require('../models/blackListModel');
require('dotenv').config;

const auth = async(req,res,next)=>{
    // console.log(req.headers);
    const header = req.headers.authorization;
    if(!header){
       res.json({message : "header is not present"})
    }
 
    const token = header.split(' ')[1];
    const blacklistCheck = await blacklistModel.findOne({token:token});

    if(blacklistCheck){
      return res.json({message : "this token is balcklisted try to get the new token"})
    }

   let decode = jwt.verify(token, process.env.SECRET_KEY,(err,result)=>{
         if(err){
            return res.status(400).json({message : err})
         }else{
            req.user = {email:result.email}
            next()
         }
         // console.log(result);
   });
//    if(!decode){
//     return res.json({message : "this is not a valid token"})
//  }else{
//     next()
//  }
//    console.log(decode)
}


module.exports = auth;