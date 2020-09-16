let administradores = require('../model/Administradores');

let uuid = require("uuid");

let cript = require('../controllers/criptografia');

module.exports={

    async cadastrarUsuario(req,res){
        let dados =req.body;
        console.log(dados)
        await administradores.create({id:uuid.v4(), nomeadministrador:dados.nome,loginadministrador:dados.email,senhaadministrador:cript.hashpassword(dados.senha),permissoes:JSON.stringify(dados.permissoes),stts:true}).then(data=>{
            res.status(200).json({message:'Cadastrado Com Sucesso'});
        }).catch(error=>{
            console.log(error);
            res.status(400).json({message:'Erro ao cadastrar',error:error});
        })
    }
}