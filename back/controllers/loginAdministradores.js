
const cript = require("./criptografia");

const Usuario = require('../model/Administradores');
const Token = require('../middleware/genereteToken'); 


require('dotenv').config();


module.exports={
    
    async login(req,res,next){

        const{email,senha}=req.body;
        Usuario.findOne({
            attributes: ['nomeadministrador', 'loginadministrador', 'senhaadministrador', 'id'],
            where: {
                loginadministrador: email
            }
        }).then((usuario) => {
    
           
            if (!usuario) {
               res.status(400).json({message:'Não foi encontrado usuario'});
               res.end();
            }else{
            const validate = cript.comparePassword(usuario.senhaadministrador, senha);
            if (validate) {
                var user = {
                    nomeUsuario: usuario.nomeadministrador,
                    emailUsuario: usuario.loginadministrador,
              
                    id: usuario.id
                }
            let token = 'Bearer '+ Token.geraNovoToken(user); 
            res.status(200).json({message:'Login realizado com sucesso',token:token,nomeUsuario:usuario.nomeadministrador});
            }else{
                res.status(400).json({message:'Senha Incorreta'});
            }
    }
})
}
}