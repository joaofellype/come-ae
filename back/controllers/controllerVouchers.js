let voucher = require('../model/Vouchers');
const moment = require('moment');
const usuario = require('../model/EnderecosUsuarios');
const enderecoUsuarios = require('../model/EnderecosUsuarios');
const pedido = require('../model/Pedidos');
let uuid = require("uuid");
let codvouchers = require('../utils/geraCodigoVoucher');
module.exports = {

    async cadastrarVoucher(req, res) {
        let dados = req.body;
        const now = new Date();
        let dataFinal = moment(dados.data_final,'DD/MM/YYYY',true).format();
        console.log(dataFinal);
        await voucher.create({
            id: uuid.v4(),
            codvouchers: codvouchers(),
            valor: parseFloat(dados.valor.replace(',', '.')),
            aplicacao: dados.aplicacao,
            nomevoucher: dados.nome,
            descricao: dados.descricao,
            data_inicial: now,
            data_final: dataFinal,
            stts: true,
            ativo: true
        }).then(data => {
            res.status(200).json({
                message: 'Cadastrado com Sucesso',
                data: data
            });
        }).catch(err => {
            console.log(err)
            res.status(400).json({
                message: 'Erro ao cadastrar'
            });
        });

    },
    async listarVouchers(req, res) {
        let voucher = await findAll();

        res.json(voucher);
    },
    async regrasVoucher(req, res) {
        let vouches = await voucher.findOne({
            where: {
                codvouchers: req.body.codvoucher
            }
        });
        const now = new Date();
        now.setHours(now.getHours()+48);

  
        if(vouches.aplicacao=='Cidade'){
           
            const cidades = await enderecoUsuarios.findAll({where:{codusaurio:req.user.numeroValidacao.id}});
            cidades.map(item=>{
                if(item.cidade ==req.body.cidade){
                    console.log('jhggug')
                }
            })

            if(!cidades){
                res.status(400).json({message:'Esse código não pode ser usuado'});
                return;
            }
            if(now < vouches.createdAt) {
                res.status(400).json({message:'Código expirado'});
                return;
            }
            res.status(200).json({message:'Sucesso',valor:vouches.valor});

        

        }
        if(vouches.aplicacao=='Primeira Compra'){
      
            const Pedido = await pedido.findOne({where:{codusuario:req.user.numeroValidacao.id}});

            if(Pedido){
                res.status(400).json({message:'Você não se encaixa nas regras'});
                return;
            }

            if(now > vouches.createdAt) {
                res.status(400).json({message:'Código expirado'});
                return;
            }
            res.status(200).json({message:'Sucesso',valor:vouches.valor});


        }


        
  if(now < vouches.createdAt) {
                res.status(400).json({message:'Código expirado'});
                return;
            }
            res.status(200).json({message:'Sucesso',valor:vouches.valor});


    }
}