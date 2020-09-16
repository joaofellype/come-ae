const jwt = require ('jsonwebtoken');
require('dotenv').config()

module.exports = (req,res,next)=>{
    console.log('osdojsod')
    let authHeader  = (req.headers.authorization==null)?req.cookies.tokenAdmin:req.headers.authorization;

    if(!authHeader)
         res.redirect('/comeae-adm');
   
    const parts = authHeader.split(' ');
    
    if(!parts.length ===2)
        return res.status(401).send({error:'Token error'});

    const [scheme, token] = parts;

    if(!/^Bearer$/i.test(scheme))
        return res.status(401).send({error :'Token mal formatado'});


    jwt.verify(token,process.env.KEY_TOKEN,(err, decoded )=>{
       
        if(err) return res.status(401).send({error:'Token invalido'});

        req.user = decoded;
        return next();
    })
}; 