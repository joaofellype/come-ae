const pedido = require('../model/Pedidos');
const Token = require('../middleware/genereteToken');
const endereco = require("../model/EnderecosUsuarios");
const tipopagamento = require("../model/TiposPagamentos");
const avaliacao = require('../model/Avaliacoes');
const motivoCancelamento = require('../model/CancelamentosPedidos');
const queue = require('../../Queue/Queue');
const relatorioProduto = require('../model/RelatoriosProdutos');
const Sequelize = require("sequelize");
const db = require('../../config/database');
const sequelize = new Sequelize(db);
//const CronJob = require('cron').CronJob;
module.exports={

    
    async cadastrarPedido(req,res){
        let dados = req.body;
        
        let errors;
        req.assert(dados.cep,'Cep Vazio').isEmpty();
        req.assert(dados.rua,'Campo Rua Vazio').isEmpty();
        req.assert(dados.nmrcasa,'Campo Número  Vazio').isEmpty();
        req.assert(dados.bairro,'Campo Bairro Vazio').isEmpty();
        errors = req.validationErrors();
          
        if (errors) {
          res.status(400).json({
            acao: 'ERRO',
            validacao: errors
          });
          res.end();
        }else{
           
           
                let refreshToken = 'Bearer '+Token.geraNovoToken(req.user.numeroValidacao);

               await endereco.create({troco:parseFloat( dados.troco),bairro:dados.bairro,rua:dados.rua,cep:dados.cep,nmrcasa:dados.nmrcasa,complemento: dados.complemento,cidade:dados.cidade,uf:dados.uf,codusuario:req.user.numeroValidacao.id}).then(dado=>{
      
                     pedido.create({
                        produtos: JSON.stringify(dados.produtos) ,
                        valor: parseFloat(dados.valor.replace("R$",'').replace(',','.')),
                        adicionais:JSON.stringify(dados.adicionais),
                        codusuario:req.user.numeroValidacao.id,
                        codstatuspedido:1,
                        codtipopagamento:dados.codpag,
                        codendereco:dado.dataValues.id,
                        codrestaurante:dados.restaurante,
                        stts:true,
                        formapagamento:dados.tipopagamento,
                        taxaentrega:parseFloat(dados.taxaentrega.replace("R$",'').replace(',','.'))
                        
                    },{returning:true}).then(data=>{ 
                        res.status(200).json({message:'Pedido feito com sucesso',data:data,token:refreshToken
                    });
                    }).catch(err=>{
                        console.log(err)
                        res.status(400).json({message:'ERRO AO FAZER PEDIDO'})
                    })
                }).catch(err=>{
                    console.log(err)
                    res.status(400).json({message: 'Erro ao salvar',err:err})
                })
                
            
                
            }
     

    },
    async cadastrarPedidoEndereco(req,res){
        let dados= req.body;

        let refreshToken = 'Bearer '+Token.geraNovoToken(req.user.numeroValidacao);
    let pedidos =  await pedido.create({
            troco:parseFloat( dados.troco),
            produtos: JSON.stringify(dados.produtos) ,
            valor: parseFloat(dados.valor.replace("R$",'').replace(',','.')),
            adicionais:JSON.stringify(dados.adicionais),
            codusuario:req.user.numeroValidacao.id,
            codstatuspedido:1,
            taxaentrega:parseFloat(dados.taxaentrega.replace("R$",'').replace(',','.')),
            formapagamento:dados.tipopagamento,
            codtipopagamento:dados.codpag,
            codendereco:dados.id,
            codrestaurante:dados.restaurante,
            stts:true
        

        },{returning:true}).then(async data=>{ 
    
            res.status(200).json({message:'Pedido feito com sucesso',data:data,token:refreshToken});
            await dados.idsProdutos.forEach(async el=>{
                await relatorioProduto.create({codproduto:el.id,codpedido:data.dataValues.id,codrestaurante:dados.restaurante,valorproduto:parseFloat(el.valor.replace("R$",'').replace(',','.'))});
           })
        }).catch(err=>{
            console.log(err)
            res.status(400).json({message:'ERRO AO FAZER PEDIDO'})
        });
        console.log(pedidos)
       
    
    },
    async listarAllPedidos(req,res){
        let pedidos = await pedido.findAll({ include:[{association:'restaurante'},{association:'usuario'},{association:'statuspedido'}], attributes:['id']});

        res.json({data:pedidos});
    },
    async listarAllPedidosOne(req,res){
        let pedidos = await pedido.findOne({ include:[{association:'restaurante'},{association:'usuario'},{association:'tipopagamento'},{association:'endereco'},{association:'statuspedido'}],where:{id:req.params.id}});

        res.json(pedidos);
    },
    async listarPedidosNovos(req,res){

        const dados = Token.getToken(req.cookies.token);
        
        const pedidos = await pedido.findAll({include:[{association:'endereco',attributes:['cidade','rua','nmrcasa','bairro']}],attributes:['id','status','produtos','createdAt'],where:{codstatuspedido:1,codrestaurante:dados.numeroValidacao.codrestaurante},
        order:[
            [
                'createdAt','DESC'
            ]
          ]});

        if(!pedidos){
            res.status(400).json({message:'Nenhum produto'})
        }
    
        res.json({data:pedidos});

    }, 
    async listarEmPreparacao(req,res){

        const dados = Token.getToken(req.cookies.token);
        
        const pedidos = await pedido.findAll({include:[{association:'endereco',attributes:['cidade','rua','nmrcasa','bairro']}],attributes:['id','status','valor','produtos','createdAt'],where:{codstatuspedido:9,codrestaurante:dados.numeroValidacao.codrestaurante},order: [
            [
              'createdAt', 'DESC'
            ]
          ]});

        if(!pedidos){
            res.status(400).json({message:'Nenhum produto'})
        }
        console.log(pedidos)


        res.json({data:pedidos});

    }, 
    async pedidoAcancelarUsuario(req,res){
        let dados = req.body;
        
        let pedidoOne = await pedido.findOne({include:[{association:'restaurante',attributes:['id']}],attributes:['id'],where:{id:req.params.id}});
        console.log(req.params.id)
        await motivoCancelamento.create({motivocancelamento:dados.solicitacao,codpedido:req.params.id,codrestaurante:pedidoOne.dataValues.restaurante.id,codusuario:req.user.numeroValidacao.id}).catch(err=>{
            console.log(err)
        })
        await pedido.update({motivocancelado_usuario:dados.solicitacao,pedidoacancelar:true},{where:{id:req.params.id}}).then(data=>{
            res.status(200).json({message:'Seu pedido foi para cancelamento'})
        }).catch(err=>{
            res.status(400).json({message:'Erro ao enviar seu pedido'});

        });
    },
    async listarPedidosEntrega(req,res){

        const dados = Token.getToken(req.cookies.token);
        
        const pedidos = await pedido.findAll({include:[{association:'endereco',attributes:['cidade','rua','nmrcasa','bairro']},{association:'usuario',attributes:['nomeusuario']}],attributes:['id','produtos','observacao','status','valor','observacao','horapreparado','createdAt'],where:{codstatuspedido:5,codrestaurante:dados.numeroValidacao.codrestaurante},order:[
            [
                'createdAt','DESC'
            ]
          ]});

        if(!pedidos){
            res.status(400).json({message:'Nenhum produto'})
        }

        res.json({data:pedidos});

    },
    async listarPedidosFinalizado(req,res){

        const dados = Token.getToken(req.cookies.token);
        
        const pedidos = await pedido.findAll({include:[{association:'endereco',attributes:['cidade','rua','nmrcasa','bairro']},{association:'usuario',attributes:['nomeusuario']}],attributes:['id','produtos','createdAt'],where:{codstatuspedido:7,codrestaurante:dados.numeroValidacao.codrestaurante},order:[
            [
                'createdAt','DESC'
            ]
          ]});

        if(!pedidos){
            res.status(400).json({message:'Nenhum produto'})
        }
        

        res.json({data:pedidos});

    },
     async listarPedidosCancelado(req,res){
 
        const pedidos = await pedido.findAll({include:[{association:'restaurante'},{association:'usuario'}], attributes:['id','usuariocancelado','horacancelado'],where:{codstatuspedido:8,codrestaurante:req.user.numeroValidacao.codrestaurante},order:[
            [
                'createdAt','DESC'
            ]
          ]});

        if(!pedidos){
            res.status(400).json({message:'Nenhum produto'})
        }
        

        res.json({data:pedidos});

    },
    async listarPedidosCanceladosAdmin(req,res){
        
        const pedidos = await pedido.findAll({include:[{association:'restaurante'},{association:'usuario'}], attributes:['id','usuariocancelado','horacancelado'],where:{codstatuspedido:8}});

        if(!pedidos){
            res.status(400).json({message:'Nenhum produto'})
        }
        

        res.json({data:pedidos});

    },
    async listarOnePedido(req,res){

        let id = req.params.id
        let token = 'Bearer ' + Token.geraNovoToken(req.user.numeroValidacao);
        const pedidos = await pedido.findOne({include:[{association:'endereco',attributes:['cidade','rua','nmrcasa','bairro']},{association:'usuario',attributes:['nomeusuario','id']},{association:'tipopagamento'}],attributes:['id','status','produtos','createdAt','adicionais','valor','observacao','troco','motivocancelado_restaurante'],where:{id:parseInt( id)}}).catch(err=>{
            console.log(err)
        });

        if(!pedidos){
          res.status(400).json({message: 'NENHUM PEDIDO',refreshToken:token});
        }
        console.log(pedidos);

        res.json(pedidos);

    },

    async confirmarPedido(req,res){
      
        let id = req.params.id;
        const now = new Date();
        now.setHours(now.getHours() - 3);
        await pedido.update({codstatuspedido:9,horaconfirmacao:now},{where:{id:id},returning:true}).then(data=>{
            res.status(200).json({message:'Pedido confirmado',data:data});
        }).catch(err=>{
            console.log(err)
        })
    },  
    async countNovosPedidos(req,res){

        let dados = await sequelize.query('SELECT count(*) FROM "Pedidos" WHERE  codrestaurante=? AND codstatuspedido=?',{replacements:[req.user.numeroValidacao.codrestaurante,1],type:sequelize.QueryTypes.SELECT});
        
        res.json(dados);
    },
     async despacharPedido(req,res){
      
        let id = req.params.id;
        const now = new Date();
        now.setHours(now.getHours() - 3);
        let user = {id:id}
        await pedido.update({codstatuspedido:5,horapreparado:now},{where:{id:id},returning:true}).then(async data=>{
                    //28800000
                await queue.concluirQueue.add({user},{delay:100000});
            res.status(200).json({message:'Pedido Despachado',data:data});
        }).catch(err=>{
            console.log(err)
        })
    },
     async cancelarPedido(req,res){

        let id = req.params.id;
        const now = new Date();
        now.setHours(now.getHours() - 3);
        await motivoCancelamento.create({motivocancelamento:req.body.motivo,codpedido:req.body.idpedido,codrestaurante:req.user.numeroValidacao.codrestaurante,codusuario:req.body.codUsuario})
        await pedido.update({motivocancelado_restaurante:req.body.motivo,pedidoacancelar:true,usuariocancelado:req.user.numeroValidacao.nomeusuario},{where:{id:req.params.id}}).then(data=>{
            res.status(200).json({message:'Seu pedido foi para cancelamento'})
        }).catch(err=>{
            res.status(400).json({message:'Erro ao enviar seu pedido'});

        });
       
    },  
     async finalizarPedido(req,res){
      
        let id = req.params.id;
        const now = new Date();
        now.setHours(now.getHours() - 3);
        await pedido.update({codstatuspedido:7,hora:now},{where:{id:id},returning:true}).then(data=>{
            res.status(200).json({message:'Pedido Despachado',data:data});
        }).catch(err=>{
            console.log(err)
        })
    }, 

    async listarPedidoUsuario(req,res){

        let id = req.params.id
        let token = 'Bearer '+Token.geraNovoToken(req.user.numeroValidacao);
        const pedidos = await pedido.findOne({include:[{association:'restaurante',attributes:['nomefantasia','id','tempoentrega']},{association:'endereco',attributes:['cidade','rua','nmrcasa','bairro']},{association:'statuspedido'},{association:'tipopagamento'}], attributes:['id','produtos','adicionais','valor','observacao','pedidoacancelar','createdAt','taxaentrega'],where:{id:id}}).catch(err=>{
            console.log(err)
        });
        
        const Avaliacao = await avaliacao.findOne({where:{codpedido:id}});
        if(!pedidos){
          res.status(400).json({message: 'NENHUM PEDIDO',refreshToken:token});
        }

        res.json({pedidos:pedidos,avaliacao:Avaliacao,token:token});

    },
   
}