const Restaurante = require('../model/Restaurantes');
const Endereco = require('../model/Enderecos');
const uuid = require('uuid');
const UsuarioRestaurante = require('../model/UsuariosRestaurantes');
const horario = require('../model/HorariosFuncionamentos');
const handlebars = require('handlebars');
const nodemailer = require('nodemailer');
const fs = require('fs');
const area = require('../model/LocalidadesRestaurantes');
const criptografia = require('./criptografia');
const token = require('../middleware/genereteToken');
const Sequelize = require("sequelize");
const db = require('../../config/database');
const favoritos = require("../model/Favoritos");
const queue = require('../../Queue/Queue');
const Op = Sequelize.Op

var CNPJ = require("cpf_cnpj").CNPJ;

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

const sequelize = new Sequelize(db);
module.exports = {

  async listarRestaurante(req, res) {

    
    const restaurante = await Restaurante.findAll({
      include: { association: 'usuario', attributes: [nomeusuario, emailusuario] }
    });
    if (restaurante == null) {
      res.status(400).json({
        message: 'Nenhum restaurante foi encontrado.'
      })
    }
    return res.json(restaurante)
  },
  async listarRestauranteCidade(req, res) {
    let paginacao = parseInt(req.params.pagina);
    let restauran = [];
    console.log(req.params.cidade)
    let a = req.params.cidade
    console.log('Alto da Esperança')
    let restaurante = await area.findAll({include:[{association:'restaurante',include:[{association:'categoria'},{association:'funcionamento'}] }],attributes:['id'], where:{cidade:'São Luís',bairro:a}, offset: paginacao,
       limit: 3}).catch(err=>{
      console.log(err)
    }) 
  
    // let restaurante = await Restaurante.findAll({
    //   include: [{ association: 'categoria' }, { association: 'endereco', attributes: ['cidade'], where: { cidade: req.params.cidade } }, { association: 'funcionamento' }],
    //   where: { status: true },
    //   offset: paginacao,
    //   limit: 3


    // });


    let ava = await sequelize.query('SELECT codrestaurante,avg(estrelas) as media, count(*) as total FROM "Avaliacoes"  GROUP BY codrestaurante;', { type: sequelize.QueryTypes.SELECT })


    if (restaurante == null) {
      console.log('sdjskdjkssd')
      res.status(400).json({

        message: 'Nenhum restaurante foi encontrado.'
      })
    }
    res.json({ restaurante: restaurante, pagina: paginacao + 3, avaliacao: ava });



  },
  async countersCategorias(req, res) {

    let pedidos = await sequelize.query('SELECT COUNT (id) as pedidos FROM "Pedidos" WHERE codrestaurante=?', { replacements: [req.user.numeroValidacao.codrestaurante], type: sequelize.QueryTypes.SELECT });
    let produtos = await sequelize.query('SELECT COUNT (id) as produtos FROM "Produtos" WHERE codrestaurante=?', { replacements: [req.user.numeroValidacao.codrestaurante], type: sequelize.QueryTypes.SELECT });
    let categorias = await sequelize.query('SELECT COUNT (id) as categorias FROM "CategoriasProdutos" WHERE codrestaurante=?', { replacements: [req.user.numeroValidacao.codrestaurante], type: sequelize.QueryTypes.SELECT });
    let grupos = await sequelize.query('SELECT COUNT (id) as grupos FROM "Grupos" WHERE codrestaurante=?', { replacements: [req.user.numeroValidacao.codrestaurante], type: sequelize.QueryTypes.SELECT });
    let avaliacao = await sequelize.query('SELECT COUNT (id) as avaliacoes FROM "Avaliacoes" WHERE codrestaurante=?', { replacements: [req.user.numeroValidacao.codrestaurante], type: sequelize.QueryTypes.SELECT });
    let adicionais = await sequelize.query('SELECT COUNT (id) as adicionais FROM "Adicionais" WHERE codrestaurante=?', { replacements: [req.user.numeroValidacao.codrestaurante], type: sequelize.QueryTypes.SELECT });
    res.json({ pedidos: pedidos, produtos: produtos, grupos: grupos, categorias: categorias, avaliacao: avaliacao, adicionais: adicionais });
  },
  async listarRestauranteCategoria(req, res) {

    console.log(req.params.cidade)
    const restaurante = await area.findAll({include:[{association:'restaurante',include:[{association:'categoria',where:{categoriarestaurante:req.params.categoria}},{association:'funcionamento'}] }],attributes:['id'], where:{bairro:'São Cristóvão'}}).catch(err=>{
   console.log(err)
 })
    let ava = await sequelize.query('SELECT codrestaurante,avg(estrelas) as media, count(*) as total FROM "Avaliacoes"  GROUP BY codrestaurante;', { type: sequelize.QueryTypes.SELECT })

    res.json({ restaurante: restaurante, avaliacao: ava });
  },
  async listarRestauranteID(id) {

    let restaurante = await Restaurante.findAll({
      include: [{ association: 'categoria' }, { association: 'endereco', attributes: ['cidade'] }], where: { id: id }

    });

    return restaurante
  },
  async listaRestauranteID(req, res) {


    if (req.cookies.tokenUsuario) {
      let usus = token.getToken(req.cookies.tokenUsuario)
      const horarios = await horario.findOne({where:{codrestaurante:req.params.id}});
      let Favoritos = await favoritos.findAll({
        include: [{
          association: 'restaurante'
        }],
        attributes: ['id', 'codrestaurante'],
        where: {
          codusuario: usus.numeroValidacao.id,
          stts: true
        }
      });

      let Horario  = await horario.findOne({codrestaurante:req.params.id});


      let restaurante = await Restaurante.findAll({
        include: [{ association: 'categoria' }, { association: 'endereco', attributes: ['cidade'] }, { association: 'funcionamento' }], where: { id: req.params.id }

      });


      let ava = await sequelize.query('SELECT codrestaurante,avg(estrelas) as media, count(*) as total FROM "Avaliacoes"  WHERE codrestaurante=?  GROUP BY codrestaurante;', { replacements: [req.params.id], type: sequelize.QueryTypes.SELECT });


      res.json({horario:Horario, restaurante: restaurante, avaliacao: ava, favoritos: Favoritos,horario:horarios });

    } else {
      const horarios = await horario.findOne({where:{codrestaurante:req.params.id}});
      let restaurante = await Restaurante.findAll({
        include: [{ association: 'categoria' }, { association: 'endereco', attributes: ['cidade'] }, { association: 'funcionamento' }], where: { id: req.params.id }

      });


      let ava = await sequelize.query('SELECT codrestaurante,avg(estrelas) as media, count(*) as total FROM "Avaliacoes"  WHERE codrestaurante=?  GROUP BY codrestaurante;', { replacements: [req.params.id], type: sequelize.QueryTypes.SELECT });


      res.json({ restaurante: restaurante, avaliacao: ava,horario:horarios });

    }
  },


  async listarAllRestaurantes(req,res){

    let dados = await Restaurante.findAll({attributes:['nomefantasia','id']});
    res.json(dados);
},
  async updateRestaurante(req, res) {

    let dados = req.body;
    console.log(dados)
    await Restaurante.update({ email: dados.campos.email, descricao: dados.campos.descricao, tempoentrega: parseInt(dados.campos.tempoentrega) }, { where: { id: req.user.numeroValidacao.codrestaurante } }).then(dado => {
      res.status(200).json({ message: 'Atualizado com sucesso!!' });
    }).catch(err => {
      res.status(400).json({ message: 'Erro ao atualizar' });
    })
  },

  async CadastrarRestaurante(req, res) {

    let idusuario = uuid.v4();
    let idrestaurante = uuid.v4();
    let dados = req.body.campos;

    req.assert(dados.nomefantasia, 'Nome fantasia vazio').isEmpty();
    req.assert(dados.razaosocial, 'Razão social vazia').isEmpty();
    req.assert(dados.email, 'Email do local vazio').isEmpty();
    req.assert(dados.numeroRestaurante, ' Telefone do local vazio').isEmpty();
    req.assert(dados.cnpj, 'CNPJ ou CPF do local vazio').isEmpty();
    req.assert(dados.cep, 'CEP vazio').isEmpty();
    req.assert(dados.rua, 'Rua vazio').isEmpty();
    req.assert(dados.nmrCasa, 'Numero do local vazio').isEmpty();
    req.assert(dados.bairro, 'Bairro vazio').isEmpty();
    req.assert(dados.cidade, 'Cidade vazio').isEmpty();
    req.assert(dados.uf, 'UF vazio').isEmpty();

    /// DADOS DO PROPRIETARIO
    req.assert(dados.nomeDono, 'Nome do proprietário vazio').isEmpty();
    req.assert(dados.cpf, 'CPF proprietário vazio').isEmpty();
    req.assert(dados.emailDono, 'Email do proprietário vazio').isEmpty();
    req.assert(dados.senhaDono, 'Senha vazia').isEmpty();
    req.assert(dados.senhaConfirm, 'Senha de confirmação vazia').isEmpty();

    let verificaCnpj = await Restaurante.findAll({ where: { cnpj: dados.cnpj } });
    if (verificaCnpj.length != 0) {
      console.log(verificaCnpj)
      res.status(400).json({
        validacao: [{
          location: "params",
          param: "",
          msg: "Esse cnpj ou cpf já está em uso",
          value: {}
        }]
      });
      return;
    }
    let verificaCPFUsusuario = await UsuarioRestaurante.findAll({ where: { cpf: dados.cpf } });
    if (verificaCPFUsusuario.length != 0) {
      res.status(400).json({
        validacao: [{
          location: "params",
          param: "",
          msg: "Esse cpf já está em uso",
          value: {}
        }]
      });

      return;
    }
    let restaurantes = await UsuarioRestaurante.findAll({ where: { emailusuario: dados.emailDono } });
    if (restaurantes.length != 0) {
      res.status(400).json({
        validacao: [{
          location: "params",
          param: "",
          msg: "Esse email ja está sendo usado. Tente outro!",
          value: {}
        }]
      });

      return;
    }
    if (dados.numeroRestaurante.length < 14 || dados.numeroRestaurante == '') {
      res.status(400).json({
        validacao: [{
          location: "params",
          param: "",
          msg: "Telefone do local vazio ou com formato inválido",
          value: {}
        }]
      })
      return;
    }
    if (dados.numeroDono.length < 14 || dados.numeroDono == '') {
      res.status(400).json({
        validacao: [{
          location: "params",
          param: "",
          msg: "Telefone do propretário vazio ou com formato inválido",
          value: {}
        }]
      })
      return;
    }

    if (dados.senhaDono != dados.senhaConfirm) {
      res.status(400).json({
        validacao: [{
          location: "params",
          param: "",
          msg: "As senhas não conferem",
          value: {}
        }]
      })
      return;
    }

    req.assert(dados.cpf, 'CPF do proprietário inválido').custom(valor => {
      const isCPF = require('is-cpf');
      if (isCPF(dados.cpf)) {
        return true
      } else {
        return false
      }
    });

    if (dados.cnpj.length == 14) {
      req.assert(dados.cnpj, 'CPF do estabelecimento inválido').custom(valor => {
        const isCPF = require('is-cpf');

        if (isCPF(dados.cnpj)) {
          return true
        } else {
          return false
        }
      });
    }

    if (dados.cnpj.length == 18) {
      if (!CNPJ.isValid(dados.cnpj)) {
        res.status(400).json({
          validacao: [{
            location: "params",
            param: "",
            msg: "CNPJ do estabelicimento inválido",
            value: {}
          }]
        });
        return;
      }
    }

    errors = req.validationErrors();

    if (errors) {
      res.status(400).json({
        acao: 'ERRO',
        validacao: errors
      });
      res.end();
      return;
    }
    var permissao = ['pedido', 'cardapio', 'finan', 'promo', 'entrega', 'pagamento', 'usuario', 'funcionamento', 'perfil']
    const email = await UsuarioRestaurante.findAll({ where: { emailusuario: dados.emailDono } });

    if (email.length != 0) {
      res.status(400).json({
        validacao: [{
          location: "params",
          param: "",
          msg: "Este email já existe em nossa base de dados",
          value: {}
        }]
      })

    }
    let senha1 = criptografia.hashpassword(dados.senhaDono)
    console.log(dados)
    let createEndereco = await Endereco.create({ nmrcasa: dados.nmrCasa, bairro: dados.bairro, rua: dados.rua, cep: dados.cep, cidade: dados.cidade, uf: dados.uf }).catch(function (error) {
      req.json(400).json({ message: 'Erro ao salvar' })
    });
    let createUsuarios = await UsuarioRestaurante.create({ id: idusuario, nomeusuario: dados.nomeDono, status: false, numerousuario: dados.numeroDono, stts: true, codrestaurante: idrestaurante, emailusuario: dados.emailDono, idcontrole:1,perfil:'Proprietário', senhausuario: senha1, cpf: dados.cpf, permissao: JSON.stringify(permissao) });

    await Restaurante.create({ id: idrestaurante, nomefantasia: dados.nomefantasia, razaosocial: dados.razaosocial, cnpj: dados.cnpj, numeroestaurante: dados.numeroRestaurante, codusuario: idusuario, codcategoria: dados.categoriaRestaurante[0], codendereco: createEndereco.id, email: dados.email, numerorestaurante: dados.numeroRestaurante, caminhofoto: dados.fotocaminho.replace('/app', '') }).then( async function (result) {
      res.status(200).json({
        message: 'Cadastro realizado com sucesso!<br>Seus dados foram enviados para análise. Em breve entraremos em contato!',
        token: token.geraNovoToken({ id: idusuario })

      });
        let user={nomeDono:dados.nomeDono,emailDono:dados.emailDono};

        await queue.cadastroRestaurante.add({user});

      // var mailOptions1;

      // readHTMLFile(__dirname + '/../../views/page_analyze.html', function (err, html) {
      //   var template = handlebars.compile(html);
      //   var replacements = {
      //     nomeusuario: dados.nomeDono,
      //   };

      //   var htmlToSend = template(replacements)

      //   mailOptions1 = {
      //     from: 'process.env.SMTP_USER',
      //     to: dados.emailDono,
      //     subject: "Aprovação cadastro Comeaê",
      //     html: htmlToSend
      //   }

      //   smtpTransport.sendMail(mailOptions1, function (error, response) {
      //     if (error) {
      //       console.log(error);
      //       response.send("error");
      //     } else {

      //       console.log("Email enviado!");


      //     }
      //   });

      // });
    }).catch(err => {
      console.log(err)
    })

  },
  async atualizarTempoEntrega(req,res){
      let dados = await req.body;
    await Restaurante.update({entregamin:dados.minimo,entregamax:dados.maximo},{where:{id:req.user.numeroValidacao.codrestaurante}}).then(data=>{
      res.status(200).json({message:'Atualizado com sucesso'});
    }).catch(err=>{
      res.status(400).json({message:'Erroo ao ser deletado'});
    })
  },
  async avaliacaoRestaurante(req, res) {
    let ava = await sequelize.query('SELECT codrestaurante,avg(estrelas) as media, count(*) as total FROM "Avaliacoes"  WHERE codrestaurante=?  GROUP BY codrestaurante;', { replacements: [req.user.numeroValidacao.codrestaurante], type: sequelize.QueryTypes.SELECT });

    res.json(ava);
  },
  async listarMaxMin(req,res){
    
    let tempoentrega = await Restaurante.findOne({attributes:['entregamin','entregamax'],where:{id:req.user.numeroValidacao.codrestaurante}});
    
    res.json(tempoentrega)
  },
  async avaliacaoRestauranteComentario(req, res) {
    let ava = await sequelize.query('SELECT avaliacao,avg(estrelas) as media, count(*) as total FROM "Avaliacoes"  WHERE codrestaurante=?  GROUP BY codrestaurante;', { replacements: [req.user.numeroValidacao.codrestaurante], type: sequelize.QueryTypes.SELECT });

    res.json(ava);
  },
  async FaturaFormPagamento(req,res){
    let tokenRefresh = 'Bearer '+token.geraNovoToken(req.user.numeroValidacao)
    let hashnome = uuid.v4();
    console.log(req.body);
    let user ={nome:hashnome,codrestaurante:req.user.numeroValidacao.codrestaurante,dataInicial:req.body.dataInicial,dataFinal:req.body.dataFinal,nomerestaurante:req.user.numeroValidacao.nomefantasia,nomeUsuario:req.user.numeroValidacao.nomeusuario};
    res.status(200).json({message:'Seu relatorio estára disponível a qualaquer instante',refreshToken:tokenRefresh})

    await queue.relatorioformaPagamento.add({user});
},
  async relatorioBairro(req,res){
    let tokenRefresh = 'Bearer '+token.geraNovoToken(req.user.numeroValidacao)

    let hashnome = uuid.v4();
    console.log(req.user);
    let user ={nome:hashnome,dataInicial:req.body.dataInicial,dataFinal:req.body.dataFinal,codrestaurante:req.user.numeroValidacao.codrestaurante,nomerestaurante:req.user.numeroValidacao.nomefantasia,nomeUsuario:req.user.numeroValidacao.nomeusuario};
    res.status(200).json({message:'Seu relatorio estára disponível a qualaquer instante',tokenRefresh:tokenRefresh})

    await queue.relatorioBairro.add({user});
},
  async relatorioProdutoMais(req,res){
    let tokenRefresh = 'Bearer '+token.geraNovoToken(req.user.numeroValidacao)

    let hashnome = uuid.v4();
    console.log(req.user);
    let user ={nome:hashnome,dataInicial:req.body.dataInicial,dataFinal:req.body.dataFinal,codrestaurante:req.user.numeroValidacao.codrestaurante,nomerestaurante:req.user.numeroValidacao.nomefantasia,nomeUsuario:req.user.numeroValidacao.nomeusuario};
    res.status(200).json({message:'Seu relatorio estára disponível a qualaquer instante',refreshToken:tokenRefresh})

    await queue.relatorioProdutoMais.add({user});
},
  async relatorioProdutoMenos(req,res){
    let tokenRefresh = 'Bearer '+token.geraNovoToken(req.user.numeroValidacao)

    let hashnome = uuid.v4();
    console.log(req.user);
    let user ={nome:hashnome,dataInicial:req.body.dataInicial,dataFinal:req.body.dataFinal,codrestaurante:req.user.numeroValidacao.codrestaurante,nomerestaurante:req.user.numeroValidacao.nomefantasia,nomeUsuario:req.user.numeroValidacao.nomeusuario};
    res.status(200).json({message:'Seu relatorio estára disponível a qualaquer instante',refreshToken:tokenRefresh})

    await queue.relatorioProdutoMenos.add({user});
},
  async relatorioProdutoMenos(req,res){
    let tokenRefresh = 'Bearer '+token.geraNovoToken(req.user.numeroValidacao)

    let hashnome = uuid.v4();
    console.log(req.user);
    let user ={nome:hashnome,dataInicial:req.body.dataInicial,dataFinal:req.body.dataFinal,codrestaurante:req.user.numeroValidacao.codrestaurante,nomerestaurante:req.user.numeroValidacao.nomefantasia,nomeUsuario:req.user.numeroValidacao.nomeusuario};
    res.status(200).json({message:'Seu relatorio estára disponível a qualaquer instante',refreshToken:tokenRefresh})

    await queue.relatorioProdutoMenos.add({user});
},
  async relatorioTurnos(req,res){
    let tokenRefresh = 'Bearer '+token.geraNovoToken(req.user.numeroValidacao)

    let hashnome = uuid.v4();
    console.log(req.user);
    let user ={nome:hashnome,dataInicial:req.body.dataInicial,dataFinal:req.body.dataFinal,codrestaurante:req.user.numeroValidacao.codrestaurante,nomerestaurante:req.user.numeroValidacao.nomefantasia,nomeUsuario:req.user.numeroValidacao.nomeusuario};
    res.status(200).json({message:'Seu relatorio estára disponível a qualaquer instante',refreshToken:tokenRefresh})
    
    await queue.relatorioTurnos.add({user});
},
async precoMininimo(req,res){

  let dados = req.query;

  let rest = await Restaurante.findOne({where:{id:dados.codrestaurante,valormin:{[Op.lt]:dados.valorMin}}});

  if(!rest){
    res.status(400).json({message:'Valor do pedido e menor que o valor Minimo'});

    return;
  }
  res.status(200).json({message:'Sucesso'});

}

}