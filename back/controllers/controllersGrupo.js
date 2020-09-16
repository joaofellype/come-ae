const grupos = require('../model/Grupos');
const token = require('../../back/middleware/genereteToken');

module.exports={
    async CadastrarGrupo(req,res){
        let dados = req.body;
        let errors;
        req.assert(dados.grupo,'Grupo Produto vazio').isEmpty();
        errors = req.validationErrors();
      
        if (errors) {
          res.status(400).json({
            acao: 'ERRO',
            validacao: errors
          });
        }
        else{ 
           await grupos.create({grupo:dados.grupo,codrestaurante:req.user.numeroValidacao.codrestaurante,
            codcriador: req.user.numeroValidacao.id  
        }).then(function(data){
                res.status(200).json({message:'Cadastrado com Sucesso'});
            }).catch(function(error){
                res.status(400).json({message:'Erro ao cadastrar '+error});

            })
        }


    },
    async listarGrupo(req,res){
        
        const Grupo = await grupos.findAll({attributes:['grupo','id'],where:{codrestaurante:req.user.numeroValidacao.codrestaurante}});
        console.log(Grupo)
        if(!Grupo){
            res.status(400).json({message:'Nenhum grupo Foi encontrada'});

        }else{
            res.json({data:Grupo});
        }
    },
    async dadosGrupo(id){
       const Grupo = await grupos.findAll({where:{id:id}});
        console.log(Grupo)
       return Grupo;
    
    },
    async listar(id){
        const Grupo = await grupos.findAll({where:{codrestaurante:id}});
        console.log(Grupo)
       return Grupo;
    },
    async UpdateGrupo(req,res){
        let id = req.params.id;
        let dados = req.body;
        let errors;
        const now = new Date();
        now.setHours(now.getHours() - 3);
        req.assert(dados.grupoUpdate,'Grupo Produto vazio').isEmpty();
        errors = req.validationErrors();

        if (errors) {
          res.status(400).json({
            acao: 'ERRO',
            validacao: errors
          });
        }else{
            await grupos.update({grupo:dados.grupoUpdate,codupdate:req.user.numeroValidacao.id,updatedAt:now},{where:{id:id}}).then(function (data){
                    res.status(200).json({message:'Atualizado com sucesso'});
            }).catch(function(error){
                res.status(400).json({message:'Erro ao Atualizar'});
            });  
        }
    },
    async DeleteGrupo(req,res){
        let id = req.params.id;
        await grupos.destroy({ where: { id: id} }).then(function(data){
            res.status(200).json({message:'Deletado com sucesso'});
        }).catch(function(error){
            res.status(400).json({message:'Erro ao deletar'});
        })
    }
}