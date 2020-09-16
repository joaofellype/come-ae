const Usuario = require("../model/UsuariosRestaurantes");
const crip = require("./criptografia");
const Token = require('../middleware/genereteToken');
var exp = Math.floor(new Date().getTime() / 1000) + (60 * 60 * 24 * 2);
module.exports={

    async login(req,res,next){
        const now = new Date();
        console.log(now);
        const {email,senha} = req.body;
        
        const user = await Usuario.findOne({where:{emailusuario:email}});
        if(!user){
            res.status(400).json({message:'Nenhum usuario Encontrado'});
        }else if(crip.comparePassword(user.senhausuario,senha)){
            var payload={
                nomeusuario:user.nomeusuario,
                emailusuario:user.emailusuario, 
                codusuario:user.id,
                codrestaurante:user.codrestaurante
                
            }
            var token = "Bearer "+Token.geraNovoToken(payload);
           
    
            res.addHeader("Authorization","Authorization")
           res.status(200).json({message:'Logado COM sucesso',token:token})
       
        }else{
            res.status(401).json({
                msg: 'Dado(s) incorreto(s)'
              });
        }
    }
}