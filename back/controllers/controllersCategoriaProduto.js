const categoria = require('../model/CategoriasProdutos');
const token = require('../middleware/genereteToken');
const t = require('../../config/database');
const Sequelize =require('sequelize');
const sequelize = new Sequelize(t);


module.exports={
    async CadastrarCategorias(req,res){
        let dados = req.body;
      
           await categoria.create({categoriaproduto:dados.categoria,codrestaurante:req.user.numeroValidacao.codrestaurante,
            codcriador: req.user.numeroValidacao.id  
           }).then(function(data){
           
        
                res.status(200).json({message:'Cadastrado com Sucesso',token:req});
            }).catch(function(error){
                res.status(400).json({message:'Erro ao cadastrar'+error,
            });

            })
        


    },
    async listarCategoriaProduto(req,res){

       
        
        const Categoria = await categoria.findAll({attributes:['categoriaproduto','id'],where:{codrestaurante:req.user.numeroValidacao.codrestaurante}});

        if(Categoria==null){
            res.status(400).json({message:'Nenhuma categoria Foi encontrada'});

        }else{
            res.json({data:Categoria});
        }
    },

    async listarCategoriaProdutoRestaurante(req,res){
        const Categoria1 = await categoria.findAll({attributes:['id','categoriaproduto'],where:{codrestaurante:req.params.id}});
        if(Categoria1==null){
            res.status(400).json({message:'Nenhuma categoria Foi encontrada'});
        }
        res.json(Categoria1);
    },
    async listarCategoria(i,cod){

        const Categoria = await categoria.findAll({attributes:['categoriaproduto','id'],where:{id:i,codrestaurante:cod}});

            return  Categoria;
        
    },  
    async listarCategoriaPromo(i){

        const Categoria = await categoria.findAll({attributes:['categoriaproduto','id'],where:{codrestaurante:i}});
            console.log(Categoria)
         return  Categoria;
        
    },
    async UpdateCategoriaProduto(req,res){
        let id = req.params.id;
        const now = new Date();
        now.setHours(now.getHours() - 3);
        let dados = req.body;
        let errors; 
        req.assert(dados.categoria,'Categoria Produto vazio').isEmpty();
        errors = req.validationErrors();
    
        if (errors) {
          res.status(400).json({
            acao: 'Erro ao atualizar produto',
            validacao: errors
          });
        }else{
            await categoria.update({categoriaproduto:dados.categoria,codupdate:req.user.numeroValidacao.id,updatedAt:now},{where:{
            id:id}}).then(function (data){
                    res.status(200).json({message:'Atualizado com sucesso'});
            }).catch(function(error){
                res.status(400).json({message:'Atualizado com sucesso'});
            });  
        }
    },
    async DeleteCategoria(req,res){
        let id = req.params.id;
        await categoria.destroy({ where: { id: id} }).then(function(data){
            res.status(200).json({message:'Deletado com sucesso'});
        }).catch(function(error){
            res.status(400).json({message:'Erro ao deletar'});
        })
    },
    async CountCategoria(id){


        const count = await categoria.findAll({
            attributes:[[sequelize.fn('count',sequelize.col('id')),'count']],
            where:{codrestaurante:id}
        });

        if(!count){
            res.json(0);
        }
        return count
    },
    async listarCategoriaRestaurante(i){

        const Categoria = await categoria.findAll({where:{codrestaurante:i}});

            return  Categoria;
        
    },
}