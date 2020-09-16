const usuario = require('../model/Usuarios');
const usuariofacebook = require('../model/UsuariosFacebooks');
const Sequelize = require('sequelize');
const usuarioRestaurante = require('../model/UsuariosRestaurantes');
const queue = require('../../Queue/Queue');
const nodemailer = require('nodemailer');
const cript = require('./criptografia');
const handlebars = require('handlebars');
const uuid = require('uuid');
const endereco = require('../model/EnderecosUsuarios');
const pedido = require('../model/Pedidos');
const favoritos = require('../model/Favoritos');
const Token = require('../middleware/genereteToken');
const categoriaRestaurante = require('../model/CategoriasRestaurantes');
const fs = require('fs');

var smtpTransport = nodemailer.createTransport({

  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  requireTLS: true,
  tls: {
    rejectUnauthorized: true
  },
  service: "Gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,

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

  async enviarEmail(req, res) {


    let dados = req.body;
    let resultado = '';

    if (!dados.email) {
      res.status(400).json({
        message: "Campo emaill vazio"
      });
      res.end();
    }

    for (var i = 0; i <= 4; i++) {

      let numero = Math.floor(Math.random() * 9 + 1).toString();

      resultado += numero;

    }


    const veficarUsuario = await usuario.findOne({
      attributes: ['nomeusuario', 'emailusuario'],
      where: {
        emailusuario: dados
          .email

      }
    });



    if (veficarUsuario) {


      if (veficarUsuario.nomeusuario != null) {
        res.status(400).json({
          data: 'Usuario existente'
        });
        return;
      }
      const agora = new Date();
      if (agora < veficarUsuario.expirestoken) {


        // readHTMLFile(__dirname + '/../../views/page_code.html', function (err, html) {
        //   var template = handlebars.compile(html);
        //   var replacements = {
        //     codigo: cript.decrypt(veficarUsuario.tokenvalidacao)
        //   };

        //   var htmlToSend = template(replacements)

        //   mailOptions = {
        //     from: 'process.env.SMTP_USER',
        //     to: veficarUsuario.emailusuario,
        //     subject: "Codigo de acesso",
        //     html: htmlToSend
        //   }


        //   smtpTransport.sendMail(mailOptions, function (error, response) {

        //     if (error) {
        //       console.log(error);
        //       res.status(400).send("error");
        //     } else {
        //       res.status(200).json({
        //         message: 'Código de verificação enviado para o seu email'
        //       });
        //     }
        //   });
        // })
        await queue.cadastroQueue({
          veficarUsuario
        })
        res.status(200).json({
          message: 'Email enviado'
        })

      } else {
        const now = new Date();
        const now1 = new Date();
        now1.setHours(now1.getHours() - 3);

        now.setHours(now.getHours() + 1);
        await usuario.update({
          tokenvalidacao: cript.encrypt(resultado),
          expirestoken: now,
          updatedAt: now1
        }, {
          where: {
            id: veficarUsuario.id
          }
        }).then(async data => {

          var mailOptions;
          await queue.cadastroQueue({
            veficarUsuario
          });
          res.status(200).json({
            message: 'Email enviado'
          })

          // readHTMLFile(__dirname + '/../../views/page_code.html', function (err, html) {
          //   var template = handlebars.compile(html);
          //   var replacements = {
          //     codigo: resultado
          //   };

          //   var htmlToSend = template(replacements)

          //   mailOptions = {
          //     from: 'process.env.SMTP_USER',
          //     to: dados.email,
          //     subject: "Codigo de acesso",
          //     html: htmlToSend
          //   }


          //   smtpTransport.sendMail(mailOptions, function (error, response) {

          //     if (error) {
          //       console.log(error)
          //       res.status(400).json({ message: error });
          //     } else {
          //       res.status(200).json({
          //         message: 'Código de verificação enviado para o seu email'
          //       });
          //     }
          //   });
          // })

        })
      }
    }

    if (!veficarUsuario) {
      const now = new Date();
      now.setHours(now.getHours() + 1);
      await usuario.create({
        id: uuid.v4(),
        emailusuario: dados.email,
        expirestoken: now,
        tokenvalidacao: cript.encrypt(resultado)
      }).then(async function (data) {
        let mailOptions;

        let user = {
          emailusuario: dados.email
        };
        await queue.cadastroQueue.add({
          user
        }, {
          delay: 100000
        });

        res.status(200).json({
          message: 'Email enviado'
        })
        // readHTMLFile(__dirname + '/../../views/page_code.html', function (err, html) {
        //   var template = handlebars.compile(html);
        //   var replacements = {
        //     codigo: resultado
        //   };

        //   var htmlToSend = template(replacements)

        //   mailOptions = {
        //     from: 'process.env.SMTP_USER',
        //     to: dados.email,
        //     subject: "Codigo de acesso",
        //     html: htmlToSend
        //   }


        //   smtpTransport.sendMail(mailOptions, function (error, response) {

        //     if (error) {
        //       console.log(error);
        //       res.status(400).json({ message: error });
        //     } else {
        //       res.status(200).json({
        //         message: 'Código de verificação enviado para o seu email'
        //       });
        //     }
        //   });
        // })

      }).catch(error => {
        console.log(error)
        res.json({
          message: error
        })
      })
    } else {
      // Reenviar O TOKEN CASO NAO TERMINOU O CADASTRO
    }

  },
  async verificarCodigo(req, res) {
    let codigo = req.body;

    const Usuario = await usuario.findOne({
      where: {
        emailusuario: codigo.email
      }
    });

    if (!Usuario) {
      res.status(400).json({
        message: 'Nenhum usuario foi encontrado'
      });
      res.end();
    }
    console.log(Usuario.dataValues.tokenvalidacao)

    if (cript.decrypt(Usuario.dataValues.tokenvalidacao) != codigo.resultado) {


      res.status(400).json({
        message: 'Código não confere'
      });
      res.end();
    }
    const now = new Date();
    now.setHours(now.getHours() - 3);

    console.log(Usuario.expirestoken)
    if (now > Usuario.dataValues.expirestoken) {
      console.log('Token expirado')

      res.status(400).json({
        message: 'Código Expirado'
      });
      res.end();
    }

    res.status(200).json({
      message: 'Sucesso. '
    });



  },
  async cadastrarUsuario(req, res) {

    let dados = req.body;
    let errors;

    req.assert(dados.nome, 'Nome Vazio').isEmpty();
    req.assert(dados.numero, 'Numero Vazio').isEmpty();
    req.assert(dados.email, 'Email Vazio').isEmpty();
    req.assert(dados.senha, 'Senha  Vazio').isEmpty();
    req.assert(dados.senhaConfirm, 'Senha de confirmação Vazio').isEmpty();
    if (dados.numero.length < 14) {
      res.status(400).json({
        validacao: [{
          location: "params",
          param: "",
          msg: "Telefone  com formato inválido",
          value: {}
        }]
      })
      res.end()
    }

    if (dados.senha != dados.senhaConfirm) {
      res.status(400).json({
        validacao: [{
          location: "params",
          param: "",
          msg: "As senhas não conferem",
          value: {}
        }]
      })
      res.end()
    }
    if (dados.senha.length < 6) {
      res.status(400).json({
        validacao: [{
          location: "params",
          param: "",
          msg: "Digite uma senha Maior que 6 caracteres",
          value: {}
        }]
      })
      res.end();
    }
    errors = req.validationErrors();

    if (errors) {
      res.status(400).json({
        acao: 'ERRO',
        validacao: errors
      });
      res.end();
    } else {

      if (dados.idfacebook) {
        await usuario.create({
          id: uuid.v4(),
          codfacebook: dados.idfacebook,
          nomeusuario: dados.nome,
          emailusuario: dados.email,
          senhausuario: cript.hashpassword(dados.senha),
          numerousuario: dados.numero
        }).then(dados => {
          res.status(200).json({
            message: 'Cadastrado com sucesso'
          });
        }).catch(err => {
          res.status(400).json({
            message: 'Erro ao cadastrar',
            erro: err
          });
        })
      } else {


        const Usuario = await usuario.findOne({
          where: {
            emailusuario: dados.email
          }
        });

        const now1 = new Date();
        now1.setHours(now1.getHours() - 3);
        usuario.update({
          nomeusuario: dados.nome,
          emailusuario: dados.email,
          senhausuario: cript.hashpassword(dados.senha),
          numerousuario: dados.numero.replace("(", "").replace('(', '').replace(')', '').replace('-', ''),
          updatedAt: now1
        }, {
          where: {
            id: Usuario.dataValues.id
          }
        }).then(function (data) {
          res.status(200).json({
            message: 'Cadastrado com sucesso'
          });
        }).catch(function (data) {
          res.status(400).json({
            message: 'Erro ao cadastrar',
            erro: data
          });
        })
      }
    }

  },

  async cadastrarEndereco(req, res) {

    let dados = req.body;
    let errors;
    req.assert(dados.cep, 'Nome Vazio').isEmpty();
    req.assert(dados.rua, 'Numero Vazio').isEmpty();
    req.assert(dados.nmrcasa, 'Email Vazio').isEmpty();
    req.assert(dados.bairro, 'Senha  Vazio').isEmpty();

    errors = req.validationErrors();

    dados.principal == true ? dados.principal = false : null;
    console.log(dados.principal)
    let token = 'Bearer ' + Token.geraNovoToken(req.user);
    if (dados.principal == 'true') {

      let enderecos = await endereco.findOne({
        where: {
          principal: true,
          stts: true,
          codusuario: req.user.numeroValidacao.id
        }
      }).catch(err => {
        console.log(err);
      });

      if (enderecos) {
        await endereco.update({
          principal: false
        }, {
          where: {
            id: enderecos.dataValues.id
          }
        })
      }
    }
    if (errors) {
      res.status(400).json({
        acao: 'ERRO',
        validacao: errors
      });
      res.end();
    } else {
      await endereco.create({
        bairro: dados.bairro,
        rua: dados.rua,
        cep: dados.cep,
        nmrcasa: dados.nmrcasa,
        cidade: dados.cidade,
        uf: dados.uf,
        codusuario: req.user.numeroValidacao.id,
        principal: dados.principal,
        complemento: dados.complemento,
        stts: true
      }).then(dado => {
        res.status(200).json({
          message: 'Cadastrado com sucesso',
          token: token
        })
      }).catch(err => {
        console.log(err)
        res.status(400).json({
          message: 'Erro ao salvar',
          err: err
        })
      })


    }

  },

  async listarUsuario(req, res) {
    let dados = await usuario.findOne({
      attributes: ['nomeusuario', 'emailusuario', 'fotousuario', 'numerousuario', 'cpf'],
      where: {
        id: req.user.numeroValidacao.id
      }
    }).catch(err => {
      console.log(err);
    })

    if (!dados) {
      console.log('Vazio')
    }

    res.json(dados);


  },
  async listarPedidosAcompanhar(req, res) {
    let refreshToken = 'Bearer '+Token.geraNovoToken(req.user.numeroValidacao);

    if (!req.user) {
      res.json(400).json({
        message: "é necessario fazer login"
      })
      return;
    }
    let pedidos = await pedido.findOne({
      include: [{
        association: 'restaurante',
        attributes: ['nomefantasia', 'tempoentrega']
      }, {
        association: 'statuspedido'
      }],
      where: {

        codusuario: req.user.numeroValidacao.id,
        id: req.params.id
      },
      attributes: ['id', 'produtos', 'adicionais', 'codstatuspedido', 'createdAt'],
      order: [
        [
          'createdAt', 'DESC'
        ]
      ]

    }).catch(err => {
      res.status(400).json({
        message: "erro ao listar."
      })
    });
    
    if (pedidos.codstatuspedido == "7") {

      res.json('Nenhum pedido em a');
      res.end();
      return;
    }
    res.json({pedidos,refreshToken})



  },
  async listarUltimoEndereco(req, res) {

    let end = await endereco.findOne({
      where: {

        codusuario: req.user.numeroValidacao.id,
        principal: true,
        stts: true
      }

    }).catch(err => {
      console.log(err)
    });
    res.json(end);

  },
  async listarUsuarioFacebook(id) {

    let dados = await usuariofacebook.findOne({
      attributes: ['nome', 'email', 'fotousuario', 'numerousuario'],
      where: {
        id: id
      }
    }).catch(err => {
      console.log(err);
    })

    if (!dados) {
      console.log('Vazio')
    } else {

      return dados;
    }

  },

  async listarPedidos(req, res) {

    let refreshToken = 'Bearer '+Token.geraNovoToken(req.user.numeroValidacao);

    let pedidos = await pedido.findAll({
      include: [{
        association: 'restaurante',
        attributes: ['nomefantasia']
      }, {
        association: 'statuspedido'
      }],
      where: {

        codusuario: req.user.numeroValidacao.id
      },
      order: [
        [
          'createdAt', 'DESC'
        ]
      ]

    }).catch(err => {
      console.log(err)
    });

    res.json({pedidos,refreshToken})
  },

  async updateUsuario(req, res) {

    let dados = req.body;
    const now = new Date();
    now.setHours(now.getHours() - 3);
    if (dados.fotocaminho == null || dados.fotocaminho == undefined) {
      dados.fotocaminho = ''
    }
    await usuario.update({
      nomeusuario: dados.nome,
      cpf: dados.cpf,
      updatedAt: now,
      numerousuario: dados.numero,
      fotousuario: dados.fotocaminho.replace("/app", '')

    }, {
      where: {
        id: req.user.numeroValidacao.id
      }
    }).then(data => {

      res.status(200).json({
        message: 'Atualizado com sucesso'
      });
    }).catch(err => {
      res.status(400).json({
        message: 'Erro ao atualizar'
      });
    })

  },
  async redefinirSenha(req, res) {
    var mailOptions;
    let dados = req.body;

    let Usuario = await usuario.findOne({
      attributes: ['id', 'emailusuario', 'nomeusuario'],
      where: {
        emailusuario: dados.email
      }
    });
    if(Usuario){
  
      const now = new Date();
      now.setHours(now.getHours() + 1);
      const now1 = new Date();
      now1.setHours(now1.getHours() - 3);
      let token = 'Bearer ' + Token.geraNovoToken(Usuario.id)
      await usuario.update({
        tokenredefinir: token,
        expiresredefinir: now,
        updatedAt: now1
      }, {
        where: {
          id: Usuario.dataValues.id
        }
      });
      let user = {
        id: Usuario.dataValues.id,
        nomeusuario: Usuario.dataValues.nomeusuario,
        emailusuario: Usuario.dataValues.emailusuario,
        token: token
      }

      res.status(200).json({
        message: 'O link para refinir foi enviado'
      })
      await queue.mailQueue.add({
        user
      });
    }
    if (!Usuario) {

      let usuarioRest = await usuarioRestaurante.findOne({
        attributes: ['id', 'emailusuario', 'nomeusuario'],
        where: {
          emailusuario: dados.email
        }
      }); 
      if(usuarioRest){
        const now = new Date();
        
        now.setHours(now.getHours() + 1);
        const now1 = new Date();
        now1.setHours(now1.getHours() - 3);
        let token = 'Bearer ' + Token.geraNovoToken(usuarioRest.id);
        await usuarioRestaurante.update({
          tokenrecuperacao: token,
          expirestoken: now,
          updatedAt: now1,
         
        }, {
          where: {
            id: usuarioRest.dataValues.id
          }}).then(async data=>{
            res.status(200).json({
              message: 'O código de redefinição foi enviado para seu e-mail'
            });
            let user = {
              id: usuarioRest.dataValues.id,
              nomeusuario: usuarioRest.dataValues.nomeusuario,
              emailusuario: usuarioRest.dataValues.emailusuario,
              token: token
            }
    
            await queue.recuperarSenhaRestaurante.add({user});
              return;
          })
     
      }

      if (!Usuario && !usuarioRest) {
        res.status(400).json({
          message: 'Nenhum Usuario foi encontrado'
        });
      }
    }



  },
  async listarEnderecosFront(id) {

    let enderecos = await endereco.findAll({
      attributes: ['id', 'bairro', 'rua', 'nmrcasa', 'uf', 'cidade', 'createdAt', 'complemento', 'principal'],
      where: {
        codusuario: id,
        stts: true
      }
    });

    return enderecos;
  },
  async listarEnderecos(req, res) {

    let enderecos = await endereco.findAll({
      attributes: ['id', 'bairro', 'rua', 'nmrcasa', 'uf', 'cidade', 'createdAt', 'principal', 'complemento'],
      where: {
        codusuario: req.user.numeroValidacao.id,
        stts: true
      }
    });

    res.json(enderecos);
  },

  async listarEnd(req, res) {

    let id = req.params.id;

    let enderecos = await endereco.findAll({
      attributes: ['cep', 'id', 'bairro', 'rua', 'nmrcasa', 'uf', 'cidade', 'complemento', 'quadra', 'principal'],
      where: {
        id: id
      }
    }).catch(err => {
      console.log(err)
    })

    res.json(enderecos);
  },
  async confirmarSenha(req, res) {

    let dados = req.body;
    const now = new Date();
    now.setHours(now.getHours() - 3);
    let dado = Token.getToken(dados.token)
    await usuario.update({
      senhausuario: cript.hashpassword(dados.senha),
      updatedAt: now 
    }, {
      where: {
        id: dado.numeroValidacao
      }
    }).then(user => {

      res.status(200).json({
        message: 'Senha redefinida com sucesso'
      });
    }).catch(err => {
      res.status(400).json({
        message: 'Erro ao redefinir a senha!',
        error: err
      });
    })


  },
  async deletarEndereco(req, res) {

    let refreshToken = 'Bearer ' + Token.geraNovoToken(req.user.numeroValidacao);
    await endereco.update({
      stts: false
    }, {
      where: {
        id: req.params.id
      }
    }).then(data => {

      res.status(200).json({
        message: 'Deletado com Sucesso',
        refreshToken: refreshToken
      });
    }).catch(err => {
      res.status(400).json({
        message: 'Erro ao deletar'
      })
    })
  },
  async editarEndereco(req, res) {
    let dados = req.body;
    let refreshToken = 'Bearer ' + Token.geraNovoToken(req.user.numeroValidacao);
    const now = new Date();
    if (dados.principal == 'true') {
      let enderecos = await endereco.findOne({
        where: {
          principal: true,
          stts: true,
          codusuario: req.user.numeroValidacao.id
        }
      });
      if (enderecos) {
        await endereco.update({
          principal: false
        }, {
          where: {
            id: enderecos.dataValues.id
          }
        })
      }
    }
    now.setHours(now.getHours() - 3);

    await endereco.update({
      cep: dados.cep,
      nmrcasa: dados.nmrcasa,
      bairro: dados.bairro,
      cidade: dados.cidade,
      rua: dados.rua,
      quadra: dados.quadra,
      uf: dados.uf,
      complemento: dados.complemento,
      principal: dados.principal,
      updatedAt: now
    }, {
      where: {
        id: req.params.id
      }
    }).then(data => {

      res.status(200).json({
        message: 'Atualizado com sucesso',
        refreshToken: refreshToken
      });
    }).catch(erro => {
      console.log(erro)
      res.status(400).json({
        message: 'Erro ao atualizar'
      });
    })
  },
  async editarPrincipal(req, res) {
    let dados = req.body;

    let refreshToken = Token.geraNovoToken(req.user.numeroValidacao);

    let enderecos = await endereco.findOne({
      where: {
        principal: true,
        stts: true,
        codusuario: req.user.numeroValidacao.id
      }
    }).catch(err => {
      console.log(err);
    });
    let enderecosone = await endereco.findOne({
      attributes: ['cidade', 'uf', 'bairro', 'nmrcasa'],
      where: {
        id: req.params.id
      }
    }).catch(err => {
      console.log(err);
    });

    if (enderecos) {
      if (enderecos.dataValues.id != req.params.id) {

        await enderecos.update({
          principal: false
        }, {
          where: {
            id: enderecos.dataValues.id
          }
        });
      }
    }
    console.log('ddkdkldd')

    await endereco.update({
      principal: true,

    }, {
      where: {
        id: req.params.id
      }
    }).then(data => {
      console.log(data)

      res.status(200).json({
        message: 'Atualizado com sucesso',
        refreshToken: refreshToken,
        endereco: enderecosone
      });
    }).catch(erro => {

      res.status(400).json({
        message: 'Erro ao atualizar'
      });
    })
  },
  async createFavoritos(req, res) {
    let dados = req.body;
    let refreshToken = 'Bearer ' + Token.geraNovoToken(req.user.numeroValidacao);

    await favoritos.create({
      codrestaurante: dados.codrestaurante,
      codusuario: req.user.numeroValidacao.id,
      stts: true
    }).then(data => {
      res.status(200).json({
        message: 'Sucesso.',
        refreshToken: refreshToken
      })
    }).catch(err => {
      console.log(err)
    })
  },
  async alterarSenha(req, res) {

    let dados = req.body
    let refreshToken = 'Bearer ' + Token.geraNovoToken(req.user.numeroValidacao);
    console.log(dados)
    let usu = await usuario.findOne({
      attributes: ['senhausuario'],
      where: {
        id: req.user.numeroValidacao.id
      }
    });
    console.log(usu.dataValues)
    const validate = cript.comparePassword(usu.dataValues.senhausuario, dados.senhaantiga);
    if (validate) {
      await usuario.update({
        senhausuario: cript.hashpassword(dados.senha)
      }, {
        where: {
          id: req.user.numeroValidacao.id
        }
      }).then(dados => {
        res.status(200).json({
          message: 'Senha Atualizada com sucesso',
          refreshToken: refreshToken
        });
      }).catch(err => {
        res.status(400).json({
          message: 'Erro ao alterar Senha'
        });
      })
    } else {
      res.status(400).json({
        message: 'Senha igual existente '
      });
    }

  },
  async listarFavorito(req, res) {

    let Favoritos = await favoritos.findAll({
      include: [{
        association: 'restaurante'
      }],
      attributes: ['codrestaurante', 'id'],
      where: {
        codusuario: req.user.numeroValidacao.id,
        stts: true
      }
    });
    let categorias = await categoriaRestaurante.findAll({
      attributes: ['id', 'categoriarestaurante']
    });


    res.json({
      favoritos: Favoritos,
      categorias: categorias
    });
  },
  async listarFavoritoOne(req, res) {

    let Favoritos = await favoritos.findAll({
      include: [{
        association: 'restaurante'
      }],
      attributes: ['id', 'codrestaurante'],
      where: {
        codusuario: req.user.numeroValidacao.id
      }
    });

    res.json(Favoritos)
  },


  async deletarFavoritos(req, res) {

    let refreshToken = 'Bearer ' + Token.geraNovoToken(req.user.numeroValidacao);
    await favoritos.update({
      stts: false
    }, {
      where: {
        id: req.params.id
      }
    }).then(data => {
      res.status(200).json({
        message: 'Sucesso.',
        refreshToken: refreshToken
      });
    });

  },


}