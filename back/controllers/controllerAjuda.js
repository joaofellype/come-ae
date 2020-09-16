const Ajuda = require('../model/Ajudas');
const uuid  = require('uuid');

module.exports={
    
    async createAjuda(req,res){

        let dados = req.body;
            console.log(dados.dados[0]);
            if(dados.dados[2]==''){
                dados.dados[2]=null
            }
        await Ajuda.create({id:uuid.v4(),motivo_ajuda:dados.dados[0],detalhes_ajuda:dados.dados[1],nome:dados.dados[3],
            email:dados.dados[4],telefone:dados.dados[5],acontecimento:dados.dados[6],codpedido:dados.dados[2]}).then(data=>{
                res.status(200).json({message:'FOI enviado com sucesso'});
            })
    },

    async listarAjuda(req,res){

        let ajudas = await Ajuda.findAll({attributes:['motivo_ajuda','detalhes_ajuda','nome','email','telefone','acontecimento','codpedido'],order:[['createdAt','DESC']]})
    }
} 