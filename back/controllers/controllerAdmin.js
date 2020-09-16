const Restaurante = require("../model/Restaurantes");
const DonoRestaurante = require("../model/UsuariosRestaurantes");
const Promocoes = require('../model/PromocoesRestaurantes');
const Pedidos = require("../model/Pedidos");
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const produtos = require('../model/Produtos');
const motivocancelamento = require('../model/CancelamentosPedidos');
const clientes = require('../model/Usuarios');
const fs = require('fs');
const queue = require('../../Queue/Queue');
const uuid = require('uuid');
const Sequelize = require("sequelize");
const db = require('../../config/database');


const sequelize = new Sequelize(db);
const Op = Sequelize.Op
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
var smtpTransport = nodemailer.createTransport({

  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  },
});
var readHTMLFile = function (path, callback) {
  fs.readFile(path, {
    encoding: 'utf-8'
  }, function (err, html) {
    if (err) {
      throw err;
      callback(err);
    } else {
      callback(null, html);
    }
  });
};

module.exports = {

  async aprovarForm(req, res) {
    let dados = req.body;
    console.log(dados);
    await Restaurante.update({
      status: true
    }, {
      where: {
        id: req.params.idrestaurante
      }
    });
    await DonoRestaurante.update({
      status: true
    }, {
      where: {
        id: req.params.idusuario
      }
    }).then(async data => {
      res.status(200).json({
        message: 'Foi aceito com sucesso'
      });

      var mailOptions1;
      let user = {nomedono:dados.nomedono,emaildono:dados.emaildono};
      await queue.aceitarRestaurante.add({user});
      // readHTMLFile(__dirname + '/../../views/page_accept.html', function (err, html) {
      //   console.log('kskldskods')
      //   var template = handlebars.compile(html);
      //   var replacements = {
      //     nomeusuario: dados.nomedono,
      //     emailLogin: dados.emaildono
      //   };

      //   var htmlToSend = template(replacements)
      //   console.log(process.env.SMTP_USER)
      //   mailOptions1 = {
      //     from: 'process.env.SMTP_USER',
      //     to: dados.emaildono,
      //     subject: "Aprovação cadastro Comeaê",
      //     html: htmlToSend
      //   }

      //   smtpTransport.sendMail(mailOptions1, function (error, response) {
      //     if (error) {
      //       console.log(error);

      //     } else {

      //       console.log("Email enviado!");


      //     }
      //   });

      // });
    })
  },

  async recusarForm(req, res) {
    let dados = req.body;
    await Restaurante.update({
      status: true
    }, {
      where: {
        id: req.params.codrestaurante
      }
    });
    await DonoRestaurante.update({
      status: true
    }, {
      where: {
        id: req.params.idusuario
      },
      returning: true
    }).then(async data => {

      res.status(200).json({
        message: 'Foi aceito com sucesso'
      });

      var mailOptions1;
        let user = {nomeusuario:dados.nomedono,emaildono:dados.emaildono,motivo:dados.motivo};
      await  queue.recusarRestaurante.add({user})
      // readHTMLFile(__dirname + '/../../views/page_refused.html', function (err, html) {
      //   var template = handlebars.compile(html);
      //   var replacements = {
      //     nomeusuario: dados.nomedono,
      //     emailLogin: dados.emaildono,
      //     motivo: dados.motivo
      //   };

      //   var htmlToSend = template(replacements)

      //   mailOptions1 = {
      //     from: process.env.SMTP_USER,
      //     to: dados.emaildono,
      //     subject: "Aprovação cadastro Comeaê",
      //     html: htmlToSend
      //   }

      //   smtpTransport.sendMail(mailOptions1, function (error, response) {
      //     if (error) {
      //       console.log(error);
      //     } else {

      //       console.log("Email enviado!");


      //     }
      //   });

      // });
    })
  },
  async listarRestaurante(req, res) {

    const restaurante = await Restaurante.findAll({
      include: [{
        association: 'endereco',
        attributes: ['bairro']
      }],
      where: {
        status: null
      },
      order: [
        [
          'createdAt', 'DESC'
        ]
      ]
    });

    res.json({
      data: restaurante
    });
  },
  async listarRestaurantesCancelado(req, res) {
    const restaurante = await Restaurante.findAll({
      include: [{
        association: 'endereco',
        attributes: ['bairro']
      }],
      attributes: ['nomefantasia', 'id', 'cnpj', 'codendereco'],
      where: {
        status: false
      },
      order: [
        [
          'createdAt', 'DESC'
        ]
      ]
    });

    res.json({
      data: restaurante
    });
  },
  async listarRestaurantesAprovados(req, res) {
    const restaurante = await Restaurante.findAll({
      include: [{
        association: 'endereco',
        attributes: ['bairro']
      }],
      where: {
        status: true
      },
      order: [
        [
          'createdAt', 'DESC'
        ]
      ]
    });

    res.json({
      data: restaurante
    });
  },
  async listarOneRestaurante(req, res) {

    let idRestaurante = req.params.idRestaurante;

    const restaurante = await Restaurante.findOne({
      include: [{
        association: 'usuario'
      }, {
        association: 'endereco',
        attributes: ['bairro', 'rua', 'nmrcasa', 'cep', 'uf', 'cidade']
      }, {
        association: 'categoria'
      }],
      where: {
        id: idRestaurante
      }
    });


    res.json(restaurante);

  },

  async listarAllRestaurantes(req, res) {

    let restaurantes = await Restaurante.findAll();
    res.json({
      data: restaurantes
    });
  },
  async CountRestaurantes(req, res) {
    let countRestaurante = await sequelize.query('SELECT count(*) as total FROM "Restaurantes"', {
      type: sequelize.QueryTypes.SELECT
    });

    res.json(countRestaurante);

  },
  async aprovarPromocoes(req, res) {
    let ids = [];
    if (req.body.idprodutos) {
      JSON.parse(req.body.idprodutos).forEach(el => {
        ids.push(parseInt(el));
      })
      console.log(ids)
      await Promocoes.update({
        stts: true
      }, {
        where: {
          id: req.params.id
        }
      }).then(data => {
        res.status(200).json({
          message: 'Promocão aprovada com sucesso'
        });
        pool.query('SELECT alterarstatus($1)', [ids], (error, results) => {
          if (error) {
            throw error
          }

          console.log(results);
        })
      }).catch(err => {
        res.status(400).json({
          message: 'Erro ao aprovar Promoção'
        });
      })

    } else {
      await Promocoes.update({
        stts: true
      }, {
        where: {
          id: req.params.id
        }
      }).then(data => {
        res.status(200).json({
          message: 'Promocão aprovada com sucesso'
        });

      })
    }

  },
  async recusarPromocao(req, res) {

    let id = req.params.id;

    await Promocoes.update({
      stts: false
    }, {
      where: {
        id: id
      }
    }).then(data => {
      res.status(200).json({
        message: 'Promoção recusada com sucesso'
      });
    }).catch(err => {
      res.status(400).json({
        message: 'Erro ao aprovar'
      })
    })
  },
  async listarPromocoes(req, res) {

    let promocoes = await Promocoes.findAll({
      include: [{
        association: 'restaurante'
      }],
      where: {
        stts: null
      },
      order: [
        [
          'createdAt', 'DESC'
        ]
      ]
    });

    res.json({
      data: promocoes
    });
  },
  async listarPromocoesInativa(req, res) {

    let promocoes = await Promocoes.findAll({
      include: [{
        association: 'restaurante'
      }],
      where: {
        stts: false
      }
    });

    res.json({
      data: promocoes
    });
  },
  async listarPromocoesAtiva(req, res) {

    let promocoes = await Promocoes.findAll({
      include: [{
        association: 'restaurante'
      }],
      where: {
        stts: true
      }
    });

    res.json({
      data: promocoes
    });
  },

  async listarPromocoesOne(req, res) {

    let promocoes = await Promocoes.findOne({
      include: [{
        association: 'restaurante'
      }],
      where: {
        id: req.params.id
      }
    });


    res.json(promocoes);
  },

  async counterAdmin(req, res) {
    let cadastros = await sequelize.query('SELECT COUNT (id) as cadastros FROM "Restaurantes" WHERE status=?', {
      replacements: [null],
      type: sequelize.QueryTypes.SELECT
    });
    let pedidos = await sequelize.query('SELECT COUNT (id) as pedidos FROM "Pedidos" WHERE codstatuspedido=?', {
      replacements: [10],
      type: sequelize.QueryTypes.SELECT
    });
    let locais = await sequelize.query('SELECT COUNT (id) as locais FROM "Cidades"', {
      type: sequelize.QueryTypes.SELECT
    });
    let totaisPromocoes = await sequelize.query('SELECT COUNT (id) as total FROM "PromocoesRestaurantes"', {
      type: sequelize.QueryTypes.SELECT
    });
    let totaispedidos = await sequelize.query('SELECT COUNT (id) as total FROM "Pedidos"', {
      type: sequelize.QueryTypes.SELECT
    });
    let totaisClientes = await sequelize.query('SELECT COUNT (id) as restaurantes FROM "Restaurantes"', {
      type: sequelize.QueryTypes.SELECT
    });
    let totaisProdutos = await sequelize.query('SELECT COUNT (id) as produtos FROM "Produtos"', {
      type: sequelize.QueryTypes.SELECT
    });

    res.json({
      cadastros: cadastros,
      pedidosAcancelar: pedidos,
      Locais: locais,
      totaisPromocoes: totaisPromocoes,
      totaisPedidos: totaispedidos,
      totaisClientes: totaisClientes,
      totaisProdutos: totaisProdutos
    });
  },
  async cancelarPedido(req, res) {
    console.log(req.params.id)
    let ped = await Pedidos.findOne({
      include: [{
        association: 'usuario'
      },{association:'restaurante'}],
      attributes: ['id'],
      where: {
        id: req.params.id
      }
    });
    let dados = req.body;
    console.log(dados)
    let user = {
      nomeusuario: ped.usuario.dataValues.nomeusuario,
      emailusuario:ped.usuario.dataValues.emailusuario,
      motivo: dados.msg,
      emailrestaurante:ped.restaurante.dataValues.email,
      nomerestaurante:ped.restaurante.dataValues.nomefantasia

    }; 
    // let userRestaurante = {
    //   nomefantasia: ped.restaurante.dataValues.nomefantasia,
    //   email: ped.restaurante.dataValues.email,
    //   motivo: dados.msg
    // };

    // console.log(userRestaurante)
    
    await Pedidos.update({codstatuspedido:8},{where:{id:req.params.id}}).then(async data=>{

      await queue.cancelamentoQueue.add({user});
      await queue.cancelamentoRestauranteQueue.add({user});
      // await queue.cancelamentoRestauranteQueue.add({userRestaurante});
      res.status(200).json({message:'Pedido Cancelado com Sucesso!'});
    })
  },
  async listarProdutos(req, res) {

    let Produtos = await produtos.findAll({
      include: [{
        association: 'restaurante'
      }],
      attributes: ['id', 'valor', 'nomeproduto']
    });
    res.json({
      data: Produtos
    });
  },
  async listarProdutosOneAdmin(req, res) {
    let Produto = await produtos.findOne({
      include: [{
        association: 'categoria'
      }],
      attributes: ['nomeproduto', 'descricao', 'valor'],
      where: {
        id: req.params.id
      }
    });

    res.json(Produto);
  },

  async listarPedidosAcancelar(req, res) {

    let pedidos = await Pedidos.findAll({
      include: [{
        association: 'restaurante'
      }, {
        association: 'usuario'
      }, ],
      where: {
        pedidoacancelar: true,
        codstatuspedido: {
          [Op.ne]: 8
        }
      },
      order: [
        [
          'createdAt', 'DESC'
        ]
      ]
    });

    res.json({
      data: pedidos
    });
  },
  async listarPedidosAcancelarOne(req, res) {

    let pedidos = await Pedidos.findOne({
      include: [{
        association: 'restaurante'
      }, {
        association: 'usuario'
      }],
      where: {
        id: req.params.id
      }
    });

    res.json(pedidos);
  },
  async mandarMsgRestaurante(req, res) {
    console.log(req.body)
    var mailOptions1;

    // readHTMLFile(__dirname + '/../../views/page_refused.html', function (err, html) {
    //   var template = handlebars.compile(html);
    //   var replacements = {
    //     nomeusuario: dados.nomedono,
    //     emailLogin: dados.emaildono,
    //     motivo:dados.motivo
    //   };

    //   var htmlToSend = template(replacements)

    //   mailOptions1 = {
    //     from: process.env.SMTP_USER,
    //     to: dados.emaildono,
    //     subject: "Aprovação cadastro Comeaê",
    //     html: htmlToSend
    //   }

    //   smtpTransport.sendMail(mailOptions1, function (error, response) {
    //     if (error) {
    //       console.log(error);
    //     } else {

    //       console.log("Email enviado!");


    //     }
    //   });

    // });

  },
  async listarUsuarios(req, res) {


    const usuarios = await clientes.findAll({
      attributes: ['id', 'nomeusuario', 'emailusuario', 'createdAt']
    });
    res.json({
      data: usuarios
    })
  },

  async listarOneUsuarios(req, res) {

    const pedido = await sequelize.query('SELECT COUNT (id) as pedidos FROM "Pedidos" WHERE codusuario=?', {
      replacements: [req.params.id],
      type: sequelize.QueryTypes.SELECT
    });
    let usuarios = await clientes.findOne({
      attributes: ['nomeusuario', 'cpf', 'emailusuario', 'numerousuario', 'createdAt'],
      where: {
        id: req.params.id
      }
    });

    res.json({
      Pedidos: pedido,
      usuarios: usuarios
    });

  },
  async mandarMsgCliente(req, res) {

    var mailOptions1;
    console.log(req.body);
    // readHTMLFile(__dirname + '/../../views/page_refused.html', function (err, html) {
    //   var template = handlebars.compile(html);
    //   var replacements = {
    //     nomeusuario: dados.nomedono,
    //     emailLogin: dados.emaildono,
    //     motivo:dados.motivo
    //   };

    //   var htmlToSend = template(replacements)

    //   mailOptions1 = {
    //     from: process.env.SMTP_USER,
    //     to: dados.emaildono,
    //     subject: "Aprovação cadastro Comeaê",
    //     html: htmlToSend
    //   }

    //   smtpTransport.sendMail(mailOptions1, function (error, response) {
    //     if (error) {
    //       console.log(error);
    //     } else {

    //       console.log("Email enviado!");


    //     }
    //   });

    // });
  },
  async atualizarRestaurante(){

    let dados = req.body;
  
      await Restaurante.update({dados},{where:{id:req.params.id}}).then(data=>{
        res.json({message:'Atualizado com Sucesso'});

      });
  },

  async relatorioFormaPagamento(req,res){
      console.log(req.params.codrestaurante)

      let user ={nome:uuid.v4(),nomeRestaurante:'Marilia Restaurante',codrestaurante:req.params.codrestaurante,dataInicial:req.body.dataInicial,dataFinal:req.body.dataFinal,nomerestaurante:req.body.nomerestaurante,nomeUsuario:req.user.numeroValidacao.nomeusuario};
      res.status(200).json({message:'Seu relatorio estára disponível a qualaquer instante'})

      await queue.relatorioFormaPagamentoAdmin.add({user});
  },
  async relatorioBairro(req,res){
    let user ={nome:uuid.v4(),codrestaurante:req.params.codrestaurante,dataInicial:req.body.dataInicial,dataFinal:req.body.dataFinal,nomerestaurante:req.body.nomerestaurante,nomeUsuario:req.user.numeroValidacao.nomeusuario};
    res.status(200).json({message:'Seu relatorio estára disponível a qualaquer instante'})

      await queue.relatorioBairroAdmin.add({user});
},
async relatorioProdutosMais(req,res){
  let user ={nome:uuid.v4(),codrestaurante:req.params.codrestaurante,dataInicial:req.body.dataInicial,dataFinal:req.body.dataFinal,nomerestaurante:req.body.nomerestaurante,nomeUsuario:req.user.numeroValidacao.nomeusuario};
  res.status(200).json({message:'Seu relatorio Foi enviado com sucesso'});
  await queue.relatorioProdutoMaisAdmin.add({user});
},
async relatorioProdutosMenos(req,res){
  let user ={nome:uuid.v4(),codrestaurante:req.params.codrestaurante,dataInicial:req.body.dataInicial,dataFinal:req.body.dataFinal,nomerestaurante:req.body.nomerestaurante,nomeUsuario:req.user.numeroValidacao.nomeusuario};
  res.status(200).json({message:'Seu relatorio estára disponível a qualaquer instante'})
  await queue.relatorioProdutoMenosAdmin.add({user});
},
async relatorioTurnos(req,res){
  let user ={nome:uuid.v4(),codrestaurante:req.params.codrestaurante,dataInicial:req.body.dataInicial,dataFinal:req.body.dataFinal,nomerestaurante:req.body.nomerestaurante,nomeUsuario:'João Fellype'};
  res.status(200).json({message:'Seu relatorio estára disponível a qualaquer instante'})
  await queue.relatorioTurnosAdmin.add({user});
}
  



}