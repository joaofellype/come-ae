const jwt = require ('jsonwebtoken');
require('dotenv').config()

module.exports = (req,res,next)=>{
    let authHeader  = (req.headers.authorization==null)?req.cookies.token:req.headers.authorization;
   
   console.log(authHeader)
    if(!authHeader)
            return res.status(400).json({
                  message: "Necessario fazer login."
            })
   
    const parts = authHeader.split(' ');
    
    if(!parts.length ===2)
        return res.status(401).send({error:'Token error'});

    const [scheme, token] = parts;

    if(!/^Bearer$/i.test(scheme))
        return res.status(401).send({error :'Token mal formatado'});


    jwt.verify(token,process.env.KEY_TOKEN,(err, decoded )=>{
       
        if(err)  res.clearCookie('token'); 

        req.user = decoded;
        return next();
    })
};    