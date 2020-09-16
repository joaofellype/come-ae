const promocao = require("../model/Promocoes");
const produtos = require("../model/Produtos");
const Promocoes = require('../model/PromocoesRestaurantes');
const localidadesRestaurantes = require('../model/LocalidadesRestaurantes');
const uuid = require('uuid')
require('dotenv').config();

const Pool = require('pg').Pool
const pool = new Pool({
    user: process.env.DB_USUARIO,
    host: process.env.DB_HOST,
    database: process.env.DB_BASE,
    password: process.env.DB_SENHA,
    ssl: true,
    port: 5432,
});
module.exports = {

    async cadastrarPromocao(req, res) {


        let dados = req.body;
        console.log(dados);
        let Promocao = await promocao.findOne({
            where: {
                descricao: dados.descricao
            }
        });
        if(dados.descricao=='Promoçao de Frete Gratis'){
            Promocoes.create({id:uuid.v4(),idsprodutos:JSON.stringify(dados.idProduto), descricao:dados.descricao,produtos:JSON.stringify(dados.bairros),
            data_inicio:dados.dataInicio,data_final:dados.dataFinal,caminhofoto:dados.fotocaminho.replace('/app', '') ,
            codpromocao:Promocao.dataValues.id,codrestaurante:req.user.numeroValidacao.codrestaurante}).then(data=>{
                res.status(200).json({message:'Promoção foi pra analise'});

            });
            return;
        }

        if(dados.categoria){
            let idCat = [];
            let valores = [];
            console.log('jsdjofsdojdkokkoko')
            Promocoes.create({id:uuid.v4(),categorias:dados.categoria.toString(), idsprodutos:JSON.stringify(dados.idProduto), descricao:dados.descricao,produtos:JSON.stringify(dados.todosProdutos),valor:parseFloat(dados.valor.replace(',','.')),
            data_inicio:dados.dataInicio,data_final:dados.dataFinal,caminhofoto:dados.fotocaminho,
            codpromocao:Promocao.dataValues.id,codrestaurante:req.user.numeroValidacao.codrestaurante}).then(data=>{
                res.status(200).json({message:'Promoção foi pra analise'});

            });
            let produtoPromo = await produtos.findAll({where:{codcategoria:dados.idCategoria[0]}}).then(data=>{
                data.forEach(el=>{
                    idCat.push(el.id)
                    valores.push(el.valor)
                });
                pool.query('SELECT alterarpromocao($1,$2,$3)',[idCat,valores,data.valor],(error,results)=>{
                    if(error){
                        throw error
                    }
        
                    console.log(results)
                })                
            })  
        }
        if(dados.idproduto){
            Promocoes.create({id:uuid.v4(),idsprodutos:JSON.stringify(dados.idProduto), descricao:dados.descricao,produtos:JSON.stringify(dados.todosProdutos),valor:parseFloat(dados.valor.replace(',','.')),
                            data_inicio:dados.dataInicio,data_final:dados.dataFinal,caminhofoto:dados.fotocaminho,
                            codpromocao:Promocao.dataValues.id,codrestaurante:req.user.numeroValidacao.codrestaurante}).then(data=>{
                                res.status(200).json({message:'Promoção foi pra analise'});

                            });
        let Porcentagem = dados.valor / 100
        pool.query('SELECT promocaoporcentagem($1,$2,$3,$4)', [dados.idproduto, dados.produtos, Porcentagem, Promocao.id], (error, results) => {
            if (error) {
                throw error
            }

            console.log(results);
        });
        return;

        }
        
        
       

    },


    async listarProdutosPromocaos(id) {

        let Produtos = await produtos.findAll({
            include: [{
                association: 'restaurante'
            }],
            where: {
                codpromocao: id,
                statuspromocao:true

            }
        });

        return Produtos
    },
    async listarPromocaosAtivas(req,res) {

        let promo = await Promocoes.findAll({

            where: {
              
                codrestaurante:req.user.numeroValidacao.codrestaurante,
                stts:true

            }
        });
            console.log(promo)
        res.json({data:promo});
    },
    
    async listarPromocaosAtivasUsuarios(req,res) {

            
        let promo = await Promocoes.findAll({ include:[{association:'promocao',attributes:['descricao']},{association:'restaurante',attributes:['id','nomefantasia']}],attributes:['codpromocao'],


            where: {
                stts:true

            }
        });
        res.json(promo);
    

    },

    async ListarTodosProdutosPromocoes(req,res){

        let restaurante = await localidadesRestaurantes.findAll({include:[{association:'restaurante',attributes:['id']}],attributes:['id'], where:{cidade:'São Luís',bairro:req.params.cidade}}).catch(err=>{
       console.log(err)
     });
        let idsRestaurantes = [];
     restaurante.forEach(el=>{
         idsRestaurantes.push( el.restaurante.id);
     })
     let produtosPromo =[];
     let Produtos;
     idsRestaurantes.forEach(async id=>{

         Produtos = await produtos.findOne({include:[{association:'restaurante',where:{id:id}}], where:{statuspromocao:true}});
         produtosPromo.push(Produtos);
        });
          console.log(produtosPromo);
    }
}