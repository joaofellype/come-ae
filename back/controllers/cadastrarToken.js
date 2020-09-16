const Token =require('../middleware/genereteToken'),Usuario = require('../model/Usuarios');

module.exports={

    async cadastrarToken(req,res){
            console.log(req.body);
        if(!req.body){
            res.status(400).json({message:'Corpo Vazio'});
        }else{
            let usuario  = await Usuario.findOne({where:{codfacebook:req.body.dados.id}});
            console.log(usuario);
            if(usuario){
                var user = {
                    nomeUsuario: usuario.nomeusuario,
                    emailUsuario: usuario.emailusuario,
                    codendereco: usuario.codendereco,
                    id: usuario.id
                }
                const token = 'Bearer ' + Token.geraNovoToken(user);
                res.status(200).json({tokenUsuario:token})
            }else{
                const token = 'Bearer ' + Token.geraNovoToken(req.body.dados);
                res.status(200).json({token:token});
            }
            
        }

    }
}