const restaurante = require('../model/restaurante'),
  produto = require('../model/produtos'),
  formAprova = require('../model/formaprovacao'),
  bairro = require('../model/bairro'),
  userRestaurante = require('../model/usuariosrestaurante'),
  promocao = require('../model/promocao')
multer = require('multer'), statusFuncionamento = require('../model/statusfuncionamento');
var CNPJ = require("cpf_cnpj").CNPJ;

const nodemailer = require('nodemailer');
const fs = require('fs')
const handlebars = require('handlebars');


var smtpTransport = nodemailer.createTransport({

  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,

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




function cadastrarRestaurante(req, res) {
  let dados = req.body.campos,
    form = {},
    errors;
  let foto = '..\\Comeaee\\views\\img\\uploads\\' + req.body.nomefoto

  /// DADOS DO LOCAL
  req.assert(dados.nomefantasia, 'Nome fantasia vazio').isEmpty();
  req.assert(dados.razaosocial, 'Razão social vazia').isEmpty();
  req.assert(dados.email, 'Email do local vazio').isEmpty();
  // req.assert(dados.numeroRestaurante, ' Telefone do local vazio').isEmpty();
  req.assert(dados.cnpj, 'CNPJ ou CPF do local vazio').isEmpty();
  req.assert(dados.cep, 'CEP vazio').isEmpty();
  req.assert(dados.rua, 'Rua vazio').isEmpty();
  req.assert(dados.nmrCasa, 'Numero do local vazio').isEmpty();
  req.assert(dados.bairro, 'Bairro vazio').isEmpty();
  req.assert(dados.cidade, 'Cidade vazio').isEmpty();
  req.assert(dados.uf, 'UF vazio').isEmpty();
  req.assert(dados.categoriaRestaurante, ' Categoria vazia').isEmpty();
  /// DADOS DO PROPRIETARIO
  req.assert(dados.nomeDono, 'Nome do proprietário vazio').isEmpty();
  // req.assert(dados.cpf, 'CPF proprietário vazio').isEmpty();
  req.assert(dados.emailDono, 'Email do proprietário vazio').isEmpty();
  req.assert(dados.senhaDono, 'Senha vazia').isEmpty();
  // req.assert(dados.senhaConfirm, 'Senha de confirmação vazia').isEmpty();


  if (dados.numeroRestaurante.length < 14 || dados.numeroRestaurante == '') {
    res.status(400).json({
      validacao: [{
        location: "params",
        param: "",
        msg: "Telefone do local vazio ou com formato inválido",
        value: {}
      }]
    })
    res.end()
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
    res.end()
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
    res.end()
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
      console.log(dados.cnpj)
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
  } else {
    form = {
      nomeFantasia: dados.nomefantasia,
      razaoSocial: dados.razaosocial,
      complemento: dados.comeplemento,
      categoria: dados.categoriaRestaurante,
      telefone: dados.numeroRestaurante,
      email: dados.email,
      cnpj: dados.cnpj,
      cep: dados.cep,
      rua: dados.rua,
      nmrCasa: dados.nmrCasa,
      bairro: dados.bairro,
      cidade: dados.cidade,
      uf: dados.uf,
      nomeDono: dados.nomeDono,
      emailDono: dados.emailDono,
      cpf: dados.cpf,
      numeroDono: dados.numeroDono,
      senhaDono: dados.senhaDono,
      caminho: foto
    }
    restaurante.createRestaurante(form).then(function (data) {
      if (!data) {
        res.status(400).json({
          validacao: [{
            location: "params",
            param: "",
            msg: "Este email já existe em nossa base de dados",
            value: {}
          }]
        })

      } else {
        res.status(200).json({
          message: 'Cadastro realizado com sucesso!<br>Seus dados foram enviados para análise. Em breve entraremos em contato!'

        })
        var mailOptions1, link1

        readHTMLFile(__dirname + '/../views/page_analyze.html', function (err, html) {
          var template = handlebars.compile(html);
          var replacements = {
            nomeusuario: form.nomeDono,
            };
  
          var htmlToSend = template(replacements)
  
          mailOptions1 = {
            from: 'comeae@andlima.com.br',
            to: form.emailDono,
            subject: "Aprovação cadastro Comeaê",
            html: htmlToSend
          }
  
          smtpTransport.sendMail(mailOptions1, function (error, response) {
            if (error) {
              console.log(error);
              response.send("error");
            } else {
  
              console.log("Email enviado!");
  
  
            }
          });
  
        }); 
      }
    })



  }
}

function cadastrarCategoria(req, res) {
  let dados = req.body
  let form = {}

  if (dados.categoria == null || dados.categoria == '') {
    res.status(400).json({
      message: 'Erro ao salvar!'
    })
    res.end()
  } else {
    res.status(200).json({
      message: 'Cadastrado com sucesso!'
    })
    form = {
      categoria: dados.categoria,
      email: req.user.emailusuario,
      codrestaurante: req.user.codrestaurante
    }
    produto.createCategoria(form)
  }
}

function cadastrarComplemento(req, res) {
  let dados = req.body
  let form = {}

  if (dados.grupo == null || dados.grupo == '') {
    res.status(400).json({
      message: 'Erro ao salvar!'
    })
    res.end()
  } else {
    res.status(200).json({
      message: 'Cadastrado com sucesso!'
    })
    form = {
      grupo: dados.grupo,
      email: req.user.emailusuario
    }
    produto.createComplemento(form)
  }
}


async function cadastrarProduto(req, res) {


  let dados = req.body.campos;
  console.log(dados)
  if (dados.nome == null) {
    res.status(400).send({
      message: 'Nome vazio'
    })
    res.end()
  }
  if (dados.idcateg == null) {
    res.status(400).send({
      message: 'Categoria Vazia'
    })
    res.end()
  }

  if (dados.preco == null) {
    res.status(400).send({
      message: 'Preço vazio'
    })
    res.end()
  } else {

    let form = {
      nome: dados.nome,
      idcateg: dados.idcateg,
      descricao: dados.descricao,
      preco: dados.preco,
      codrestaurante: req.user.codrestaurante,
      adicionais: req.body.adicionais,
      caminho: dados.fotocaminho
    }
    console.log(form);

    let retorno = produto.createProdutos(form)
    if (!retorno) {
      res.status(400).json({
        message: 'erro ao salvar'
      })
    } else {
      res.status(200).json({
        message: 'Salvo com sucesso'
      })
    }

  }

}
async function createHorario(req, res) {

  dado = req.body;
  let form = {};
  console.log(dado)
  form = {
    segunda: dado.segunda,
    terca: dado.terca,
    quarta: dado.quarta,
    quinta: dado.quinta,
    sexta: dado.sexta,
    sabado: dado.sabado,
    domingo: dado.domingo,
    iddono: req.user.codrestaurante
  };
  restaurante.createHorario(form).then(function (data) {
    if (data == true) {
      res.json({
        message: 'Horario salvo com sucesso!'
      })
    }


  });


}
async function aprovarForm(req, res, caminho) {
  let dados = req.body.campos,
    form = {
      email: dados.email2,
      bairro: dados.bairro,
      emailContato: dados.email,
      foto: caminho,
      codrestaurante: req.user.codrestaurante
    };
  console.log(dados)
  formAprova.aprovarForm(form).then(function (data) {
    if (!data) {
      res.status(400).json({
        message: 'Erro ao enviar'
      });
      return;
    } else {
      res.status(200).json({
        message: 'Enviado com sucesso'
      });
      return;
    }
  })

}


async function createUsuarioRestaurante(req, res) {

  let dados = req.body.campos,
    form = {},
    permissoes = [],
    errors;
  console.log(dados);
  req.assert(dados.nome, 'Campo <b>nome</b> vazio').isEmpty()
  req.assert(dados.selPermissao, 'Campo  <b>perfil</b> vazio').isEmpty()
  req.assert(dados.senha, 'Campo <b>senha</b> vazio').isEmpty()
  req.assert(dados.confirmSenha, 'Campo <b>confirmar senha</b> vazio').isEmpty()
  req.assert(dados.email, 'Campo <b>email</b> vazio').isEmpty()
  if (dados.selPermissao == '1') {
    permissoes = [

    ]
  } else if (dados.selPermissao == '2') {
    permissoes = [

    ]
  } else if (dados.selPermissao == '3') {
    permissoes = [
      'pedido',
      'cardapio',
      'finan',
      'promo',
      'entrega',
      'pagamento',
      'usuario',
      'funcionamento',
      'perfil'
    ]
  } else if (dados.selPermissao == '4') {
    permissoes = [
      'pedido',
      'cardapio',
      'promo',
      'entrega',
      'pagamento',
      'usuario'
    ]
  } else if (dados.selPermissao == '5') {
    permissoes = [
      'pedido',
      'cardapio',
      'entrega',
      'funcionamento'
    ]
  }

  if (dados.senha.length < 6) {
    res.status(400).json({
      validacao: [{
        location: "params",
        param: "",
        msg: "Digite uma senha com no mínimo 6 caracteres",
        value: {}
      }]
    })
  }
  if (dados.senha != dados.confirmSenha) {
    res.status(400).json({
      validacao: [{
        location: "params",
        param: "",
        msg: "Senhas <b>incompatíveis</b>",
        value: {}
      }]
    })
  }
  errors = req.validationErrors();
  if (errors) {
    res.status(400).json({
      acao: 'ERRO',
      validacao: errors
    });
  } else {
    form = {
      nome: dados.nome,
      email: dados.email,
      senha: dados.senha,
      permissao: permissoes,
      perfil: req.body.perfil,
      codrestaurante: req.user.codrestaurante

    }
    let retorno = userRestaurante.createUsuariosRestaurante(form);
    if (!retorno) {
      res.status(400).json({
        message: 'Erro ao salvar'
      })
    } else {
      res.status(200).json({
        message: 'Usuario Cadastrado'
      })
    }

  }
}

async function editarCategoria(req, res) {
  let dados = req.body;
  let id = req.params.id
  let form = {
    campos: dados.categoria,
    id: id,
    editar: dados.editarCategoria
  }
  console.log(dados)

  let retorno = produto.editarCategoria(form);
  console.log(retorno)
  if (!retorno) {
    res.json({
      message: 'Erro ao editar'
    })

  } else {
    res.json({
      message: 'Editado com sucesso'
    })
  }
}
async function editarGrupo(req, res) {
  let dados = req.body;
  let id = req.params.id
  let form = {
    campos: dados.categoria,
    id: id,
    nomeGrupo: dados.editarGrupo
  }
  console.log(dados)

  let retorno = produto.editarGrupo(form);
  if (!retorno) {
    res.json({
      message: 'Erro ao editar'
    })
  } else {
    res.json({
      message: 'Salvo com sucesso'
    })
  }


}
async function editarProduto(req, res) {
  let dados = req.body.campos,
    form = {},
    errors;
  req.assert(dados.nomeEdit, 'Nome Produto Vazio').isEmpty();
  req.assert(dados.valorEdit, 'Valor Vazio').isEmpty();
  console.log(dados)
  console.log(req.body)
  if (errors) {
    res.status(400).json({
      acao: 'ERRO',
      validacao: errors
    });
  } else {
    form = {
      nomeEdit: dados.nomeEdit,
      descricaoEdit: dados.descricaoEdit,
      valorEdit: dados.valorEdit,
      iddesc: dados.iddesc,
      caminho: dados.caminhofotoEditar,
      adicionais: req.body.adicionais
    }


    let retorno = produto.editarProduto(form);
    if (!retorno) {
      res.json({
        message: "Erro ao salvar"
      })
    } else {
      res.json({
        message: "Editado com sucesso!"
      })
    }
  }

}
async function editarComplementos(req, res) {
  let dados = req.body.campos,
    form = {},
    errors;
  console.log(dados)
  req.assert(dados.nomeComple, 'Nome Produto Vazio').isEmpty();

  if (errors) {
    res.status(400).json({
      acao: 'ERRO',
      validacao: errors
    });
  } else {
    form = {
      nomeEdit: dados.nomeComple,
      descricaoEdit: dados.descComple,
      valorEdit: dados.valorComple,
      iddesc: dados.idAdicional
    }
    produto.editarComplemento(form).then(function (data) {
      if (!data) {
        res.json({
          message: "Erro ao salvar"
        })
      }
      res.json({
        message: "Editado com sucesso"
      })
    })


  }
}
async function excluirProduto(req, res, id) {

  produto.excluirProduto(id, req.user.codrestaurante).then(function (dado) {
    if (!dado) {
      res.status(400).json({
        message: "Erro ao deletar!"
      })
      return;
    } else {
      res.status(200).json({
        message: "Sucesso ao deletar!"
      })
      return;
    }

  })
}
async function excluirAdicionais(req, res, id) {

  produto.excluirComplemento(id, req.user.codrestaurante).then(function (dado) {
    if (!dado) {
      res.status(400).json({
        message: "Erro ao deletar!"
      })
      return;
    }
    res.status(200).json({
      message: "Deletado com sucesso!"
    })
    return;
  })
}

async function excluirCategoria(req, res, nome) {
  produto.excluirCategoria(nome, req.user.codrestaurante).then(function (dado) {
    if (!dado) {
      res.status(400).json({
        message: "Erro ao deletar!"
      })
      return;
    } else {
      res.status(200).json({
        message: "Sucesso ao deletar!"
      })
      return;
    }
  })
}

async function excluirGrupo(req, res, nome) {
  produto.excluirGrupo(nome, req.user.codrestaurante).then(function (dado) {
    if (!dado) {
      res.status(400).json({
        message: "Erro ao deletar!"
      })
      return;
    } else {
      res.status(200).json({
        message: "Sucesso ao deletar"
      })
      return;
    }
  })
}

async function createAdicionais(req, res) {
  let dados = req.body.campos,
    form = {},
    errors;
  console.log(dados)
  req.assert(dados.nome, 'Nome Complemento Vazio').isEmpty();

  errors = req.validationErrors();
  if (errors) {
    res.status(400).json({
      acao: 'ERRO',
      validacao: errors
    });
  } else {
    form = {
      nome: dados.nome,
      descricao: dados.desc,
      valor: dados.valor,
      grupo: dados.grupo,
      codrestaurante: req.user.codrestaurante
    }

    produto.createAdicionais(form).then(function (param) {
      if (!param) {
        res.status(400).json({
          message: 'Erro ao salvar'
        });
      }
      res.status(200).json({
        message: 'Salvo com sucesso'
      });
    })
  }
}

async function createArea(req, res) {

    let dados = req.body.campos;
    let form = {
      area: dados,
      codrestaurante: req.user.codrestaurante
    }
    console.log(form)
    bairro.createArea(form).then(function (data) {
      if (!data) {
        res.status(400).json({
          message: 'ERRO'
        })
      }
      res.status(200).json({
        message: 'Salvo'
      })
    })
}
async function createPromocao(req, res) {
  let dados = req.body;
  console.log(dados)
  let form = {
    descricao: dados.descricao,
    categoria: dados.categoria,
    produtos: dados.produtos,
    codrestaurante: req.user.codrestaurante,
    valor: dados.valor,
    data_inicio: dados.dataInicio,
    data_final: dados.dataFinal
  }
  promocao.createPromocao(form).then(function (data) {
    if (!data) {
      res.status(400).json({
        message: 'ERRO'
      })
    }
    res.status(200).json({
      message: 'Salvo'
    })
  })
}

async function editarStatusProduto(req, res) {
  let dados = req.body,
    form;

  form = {
    status: dados.status,
    nome: dados.nome,
    codrestaurante: req.user.codrestaurante
  }
  produto.editarProdutoStatus(form).then(function (data) {
    if (!data) {
      res.json({
        message: 'Erro ao atualizar'
      });
    } else {
      res.json({
        message: 'Suceeso ao atualizae'
      })
    }
  })
}

async function exclurUsuario(req, res, nome) {

  if (nome == req.user.nomeusuario) {
    res.status(400).json({
      message: "Não possui permissão para deletar este usuario!"
    })
    return;
  }
  userRestaurante.deleteUsuarios(nome, req.user.codrestaurante).then(function (dado) {
    if (!dado) {
      res.status(400).json({
        message: "Não possui permissão para deletar este usuario!"
      })
      res.end()

    }
    res.status(200).json({
      message: "Sucesso"
    });
    res.end()
  })
}

function createStatusFuncionamento(req, res) {
  let dados = req.body;
  console.log(dados);
  let form = {
    status: dados.status,
    codrestaurante: req.user.codrestaurante
  };

  statusFuncionamento.createStatusFuncionamento(form).then(function (dado) {
    if (!dado) {
      console.log('errp')
    } else {
      console.log('ksjksks');
    }
  })
}

function aprovarForma(idrestaurante, idusuario, dados) {

  let form = {
    idusuario: idusuario,
    idrestaurante: idrestaurante,
  }
console.log(dados)
  restaurante.aprovarRestautante(form).then(function (data) {

    if (!data) {
      res.status(400).json({
        message: 'ERRO AO ACEITAR'
      })
    } else {
      var mailOptions1, link1

      readHTMLFile(__dirname + '/../views/page_accept.html', function (err, html) {
        var template = handlebars.compile(html);
        var replacements = {
          nomeusuario: dados.nomePropietario,
          emailLogin: dados.emailUsuario
        };

        var htmlToSend = template(replacements)

        mailOptions1 = {
          from: 'comeae@andlima.com.br',
          to: dados.emailUsuario,
          subject: "Aprovação cadastro Comeaê",
          html: htmlToSend
        }

        smtpTransport.sendMail(mailOptions1, function (error, response) {
          if (error) {
            console.log(error);
            response.status(200).send("error");
          } else {

            console.log("Email enviado!");


          }
        });

      });

    }
  })
}


function recusaForm(req,res){
  let dados = req.body;
  console.log(dados)
  var mailOptions1, link1

  var mailOptions1, link1

  readHTMLFile(__dirname + '/../views/page_refused.html', function (err, html) {
    var template = handlebars.compile(html);
    var replacements = {
      nomeusuario: dados.nomePropietario,
      emailLogin: dados.emailUsuario
    };

    var htmlToSend = template(replacements)

    mailOptions1 = {
      from: 'comeae@andlima.com.br',
      to: dados.emailUsuario,
      subject: "Aprovação cadastro Comeaê",
      html: htmlToSend
    }

    smtpTransport.sendMail(mailOptions1, function (error, response) {
      if (error) {
        console.log(error);
        response.status(200).send("error");
      } else {

        console.log("Email enviado!");


      }
    });

  });
  
}
module.exports = {
  cadastrarRestaurante,
  cadastrarCategoria,
  cadastrarComplemento,
  cadastrarProduto,
  createHorario,
  createUsuarioRestaurante,
  editarCategoria,
  editarGrupo,
  editarProduto,
  excluirProduto,
  excluirCategoria,
  createAdicionais,
  createArea,
  excluirGrupo,
  editarComplementos,
  excluirAdicionais,
  aprovarForm,
  createPromocao,
  editarStatusProduto,
  exclurUsuario,
  createStatusFuncionamento,
  aprovarForma,
  recusaForm

}