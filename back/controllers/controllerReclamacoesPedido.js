const reclamacoes  = require('../model/ReclamacoesPedidos');

const uuid = require('uuid');
module.exports={

    async createReclamacao(req,res){

        let dados = req.body;

        await reclamacoes.create({id:uuid.v4(), motivo_reclamacao:dados.motivo_reclamacao,codpedido:dados.codpedido,codusuario:req.user.numeroValidacao.id}).then(data=>{
            res.status(200).json({message:'Sua reclamação foi enviada com sucesso'});
        }).catch(err=>{
            res.status(400).json({message:'Erro ao enviar'});
        });

        
    },

    async listarReclamacoes(req,res){

        let reclamacao = await reclamacoes.findAll({include:[{association:'pedido'},{association:'usuario'}],order:[['createdAt','DESC']]});

        res.json(reclamacao);
    }
}