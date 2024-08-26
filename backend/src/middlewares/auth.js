const jwt = require('jsonwebtoken');

require('dotenv').config;

const auth = async(req,res,next)=>{

    const header = req.headers.authorization;
    if(!header){
       res.json({message : "header is not present"})
    }
 
    const token = header.split(' ')[1];


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