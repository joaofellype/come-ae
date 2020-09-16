const jwt = require("jsonwebtoken");

require('dotenv').config()
const v = require('uuid')

module.exports = {
  geraNovoToken(params){
     
      return jwt.sign({numeroValidacao:params},process.env.KEY_TOKEN,{
          expiresIn:process.env.TIME_TOKEN,
        
      });
   
  },
  geraToken(req) {

    const usertoken = req
    const tokenjwt = usertoken.split(' ');
    const jwt_payload = jwt.verify(tokenjwt[1], process.env.KEY_TOKEN);

    var token = jwt.sign(jwt_payload, process.env.KEY_TOKEN, {
      expiresIn: process.env.TIME_TOKEN,
      jwtid:v.v4()
    });
    return token

  },
  getUsuario(cabecalho) {
    const usertoken =cabecalho.headers.authorization;
    const tokenjwt = usertoken.split(' ');
   
    const jwt_payload = jwt.verify(tokenjwt[1], process.env.KEY_TOKEN);
      
    return jwt_payload
  }, 
   getToken(cabecalho) {
    const usertoken =cabecalho;
    const tokenjwt = usertoken.split(' ');
   
    const jwt_payload = jwt.verify(tokenjwt[1], process.env.KEY_TOKEN);
      
    return jwt_payload
  },
  geraTokenVerificacao(dados){
    return jwt.sign(dados,process.env.KEY_TOKEN,{
      expiresIn:process.env.TIME_TOKEN,
    
  });
  }
}