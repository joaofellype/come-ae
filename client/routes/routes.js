const express = require('express'),
    router = express.Router(),
    Authenticate = require('../../back/middleware/authentic'),
    autenticRest = require('../../back/middleware/authenticRest'),
    autenticAdmin = require('../../back/middleware/authenticAdmin'),
    busca = require("../../back/controllers/busca"),
    Token = require('../../back/middleware/genereteToken'),
    categoriaProduto = require('../../back/controllers/controllersCategoriaProduto'),
    adicionais = require('../../back/controllers/controllersAdicionais'),
    restaurante = require('../../back/controllers/controllersRestaurante'),
    grupo = require('../../back/controllers/controllersGrupo'),
    carrinho = require("../../back/controllers/controllersCarrinho")
passport = require("passport");
categoriaRestaurante = require('../../back/controllers/controllerCategoriasRestaurantes');
const usuario = require('../../back/controllers/controllersUsuario');
const funcionamento = require('../../back/controllers/controllerStatusFuncionamento')
const promocao = require('../../back/controllers/controllersPromocoes');
const cam = require('../../views/img/uploads/caminho');

router.get("/", function (req, res) {
    res.render('intro')
});

router.get("/newpasswordclient", function (req, res) {
    res.render('newpasswordclient')
});

router.get('/function', (req, res) => {
    busca.funcaoPromocao(18, 55)
})
router.get('/dados', (req, res) => {

    if (req.cookies.tokenUsuario != undefined) {
        let dados = Token.getToken(req.cookies.tokenUsuario);
        res.render('dados', {
            cod: dados.numeroValidacao.id
        })
    } else {
        res.redirect('/comeae');
    }
})

router.get('/enderecos', (req, res) => {
    if (req.cookies.tokenUsuario != undefined) {
        let dados = Token.getToken(req.cookies.tokenUsuario);
        res.render('enderecos', {
            cod: dados.numeroValidacao.id
        })
    } else {
        res.redirect('/comeae');
    }
})

router.get("/pedidos", function (req, res) {
    if (req.cookies.tokenUsuario != undefined) {
        let dados = Token.getToken(req.cookies.tokenUsuario);
        res.render('pedidos', {
            cod: dados.numeroValidacao.id
        });
    } else {
        res.redirect('/comeae');
    }
});

router.get("/cupons", Authenticate, function (req, res) {
    res.render('cupons');
});

router.get('/categorias/:cidade/:categoria', (req, res) => {
    res.render('categorias', {
        categoria: req.params.categoria
    });
})

router.get('/restaurantesLog', (req, res) => {
    if (!req.cookies.tokenUsuario) {
        res.redirect('/ent_cad');
    } else {
        if (req.cookies.endereco) {

            let cidade = JSON.parse(req.cookies.endereco);
            restaurante.listarRestauranteCidade(cidade[1]).then(function (data) {
                res.render("startlog", {
                    rest: data
                });

            })
        } else {
            res.render("startlog")
        }
    }
});

router.get('/cam', cam.caminho);

router.get("/restaurantes/:cidade", Authenticate, (req, res) => {
    console.log(req.params.cidade)
    restaurante.listarRestauranteCidade(req.params.cidade).then(function (data) {
        res.render("startlog", {
            rest: data
        });
    })
});

router.get("/admin_ava", autenticRest, function (req, res) {

    res.render('admin_ava', {
        nome: req.user.numeroValidacao.nomefantasia,
        email: req.user.numeroValidacao.emailusuario
    })
})

router.get('/search', (req, res) => {
    res.render("searchrest");
});
router.get('/facebook_teste', (req, res) => {
    res.render("facebookteste");
});

router.get("/teste1", (req, res) => {
    res.render('teste1');
});

router.get('/redefinirSenha/:email/:token', (req, res) => {

    res.render('newpasswordclient', {
        token: req.params.token
    });
})
router.get('/redefinirSenhaRestaurante/:email/:token', (req, res) => {

    res.render('newpassword', {
        token: req.params.token
    });
})

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/ent_cad'
}), (req, res) => {
    console.log(req.user.dataValues)
    var user = {
        nomeusuario: req.user.dataValues.nome,

        login: 'facebook',
        id: req.user.dataValues.id
    }
    let token = 'Bearer ' + Token.geraNovoToken(user);
    res.cookie('tokenUsuario', token);
    res.redirect('/comeae');
})

router.get('/promocoes/:nome/:id', (req, res) => {
    let cidade = JSON.parse(req.cookies.endereco);
    res.render('promocoes')
});

router.get("/admin_profile", autenticRest, function (req, res) {
    restaurante.listarRestauranteID(req.user.numeroValidacao.codrestaurante).then(dado => {
        res.render('admin_profile', {
            nome: req.user.numeroValidacao.nomefantasia,
            email: req.user.numeroValidacao.emailusuario,
            dado: dado,
            foto: dado[0].caminhofoto.replace('/app', '')
        });
    });
})

router.get("/admin_users", autenticRest, function (req, res) {
    res.render('admin_users', {
        nome: req.user.numeroValidacao.nomefantasia,
        email: req.user.numeroValidacao.emailusuario,
        idrestaurante: req.user.numeroValidacao.codrestaurante,
    })
})

router.get("/admin_promo", autenticRest, (req, res) => {
    categoriaProduto.listarCategoriaPromo(req.user.numeroValidacao.codrestaurante).then(categoria => {
        res.render('admin_promo', {
            nome: req.user.numeroValidacao.nomefantasia,
            email: req.user.numeroValidacao.emailusuario,
            idrestaurante: req.user.numeroValidacao.codrestaurante,
            idusuario: req.user.numeroValidacao.idusuario,
            categoria: categoria
        })
    })
})

router.post("/cad_rest", (req, res) => {
    categoriaRestaurante.listarCategoriaRestaurante().then(cat => {
        res.render('CriarConta', {
            nome_fantasia: req.body.nome_rest,
            email_rest: req.body.emailcad_rest,
            cel_rest: req.body.telefone_rest,
            cat: cat
        })
    })
})

router.get('/acompanhar/:id', (req, res) => {
    if (req.cookies.tokenUsuario != undefined) {
        let dados = Token.getToken(req.cookies.tokenUsuario);
        res.render('acompanhar', {
            codusuario: dados.numeroValidacao.id,
            codpedido: req.params.id
        });
    } else {
        res.redirect('/comeae');
    }
})

router.get('/comeae-adm', (req, res) => {
    res.render('comeae-adm')
})

router.get('/resumo-adm', (req, res) => {
    res.render('resumo-adm')
})
router.get('/cadastros-adm', (req, res) => {
    res.render('cadastros-adm')
})
router.get('/promocoes-adm', (req, res) => {
    res.render('promocoes-adm')
})
router.get('/pedidos-adm', (req, res) => {
    res.render('pedidos-adm')
})
router.get('/clientes-adm', (req, res) => {
    res.render('clientes-adm')
})
router.get('/produtos-adm', (req, res) => {
    res.render('produtos-adm')
})
router.get('/gerencia-adm', (req, res) => {
    res.render('gerencia-adm')
})
router.get('/relatorios-adm', (req, res) => {
    res.render('relatorios-adm')
})
router.get('/voucher-adm', (req, res) => {
    res.render('voucher-adm')
})

router.get("/admin_hr", autenticRest, (req, res) => {
    res.render('admin_hr', {
        nome: req.user.numeroValidacao.nomefantasia,
        email: req.user.numeroValidacao.emailusuario,
        idrestaurante: req.user.numeroValidacao.codrestaurante,
    })
})

router.post("/logged", function (req, res) {
    var erros = []
    if (!req.body.email_log || typeof req.body.email_log == undefined || req.body.email_log == null) {
        erros.push({
            texto: "Email de login vazio!"
        })
    }
    if (!req.body.senha_log || typeof req.body.senha_log == undefined || req.body.senha_log == null) {
        erros.push({
            texto: "Senha de login vazio!"
        })
    }
    if (req.body.senha_log.length < 6) {
        erros.push({
            texto: "Senha muito pequena!"
        })
    }
    if (erros.length > 0) {
        res.render("ent_cad", {
            erros: erros
        })
    } else {
        console.log("Campos preenchidos!")
        console.log("Campos preenchidos!")
        res.render("ent_cad")
    }
})

router.get("/confirm-codigo/:email", function (req, res) {
    res.render('Cadastrar', {
        email: req.params.email
    });
})

router.get("/admin_card/complementos/:id", autenticRest, function (req, res) {
    grupo.dadosGrupo(req.params.id).then(function (data) {
        res.render('complementos', {
            nome: req.user.numeroValidacao.nomeusuario,
            email: req.user.numeroValidacao.emailusuario,
            codrestaurante: req.user.numeroValidacao.codrestaurante,
            categ: data
        })
    })
})

router.get("/restaurante", function (req, res) {
    if (req.cookies.tokenUsuario) {
        res.redirect('/restaurantesLog');
    } else {
        res.render('restaurante');
    }
})
router.get("/admin_relatorio", function (req, res) {
    res.render('admin_relatorio')
})

router.get("/client", function (req, res) {
    res.render('client')
})
router.get("/admin_client", function (req, res) {
    res.render('admin_client')
})

router.get("/rest_promo", function (req, res) {
    res.render("rest_promo")
})

router.get("/rest_prod", function (req, res) {
    res.render("rest_prod")
})

router.get("/restaurante", function (req, res) {
    res.render("restaurante");
})

router.get("/comeae", function (req, res) {
    res.render("comeae")
})

router.get("/ajuda", function (req, res) {
    res.render("ajuda")
})

router.get("/busca", function (req, res) {
    res.render("busca", {
        query: req.query.search
    });
})
router.get("/lista-restaurante/:id", (req, res) => {
    res.render("restaurante", {
        codrestaurante: req.params.id
    });
});

router.get("/promocoes", function (req, res) {
    res.render("promocoes")
})

router.get("/log_rest", function (req, res) {
    res.render("log_rest")
});

router.get('/count', autenticRest, categoriaProduto.CountCategoria);

router.get("/admin_data", function (req, res) {
    res.render('admin_data')
})

router.get("/admin_rest", function (req, res) {
    res.render('admin_rest')
})

router.get("/admin_card", autenticRest, function (req, res) {
    res.render('admin_card', {
        nome: req.user.numeroValidacao.nomefantasia,
        email: req.user.numeroValidacao.emailusuario,
        idrestaurante: req.user.numeroValidacao.codrestaurante,
        idusuario: req.user.id
    })
})

router.get("/admin_start", autenticRest, (req, res) => {
    res.render("admin_start", {
        nome: req.user.numeroValidacao.nomefantasia,
        email: req.user.numeroValidacao.emailusuario,
        idusuario: req.user.numeroValidacao.id,
        codrestaurante: req.user.numeroValidacao.codrestaurante
    });
})

router.get("/admin_card/produto/:id", autenticRest, (req, res) => {
    const produto = req.params.id;
    categoriaProduto.listarCategoria(produto, req.user.numeroValidacao.codrestaurante).then(function (params) {
        grupo.listar(req.user.numeroValidacao.codrestaurante).then(function (data) {
            res.render('produto', {
                grupocomps: data,
                params: params,
                produto: produto,
                nome: req.user.numeroValidacao.nomefantasia,
                email: req.user.numeroValidacao.emailusuario,
                idrestaurante: req.user.numeroValidacao.codrestaurante,
            })
        })
    })
})

router.get("/", function (req, res) {
    res.render('admin_add')
})

router.get("/cad_rest", function (req, res) {
    res.render('cad_rest')
});

router.get("/admin_areas", autenticRest, function (req, res) {
    res.render('admin_areas', {
        nome: req.user.numeroValidacao.nomefantasia,
        email: req.user.numeroValidacao.emailusuario,
        codrestaurante: req.user.numeroValidacao.codrestaurante,
        idusuario: req.user.idusuario
    })
})

router.get("/admin_ped", autenticRest, function (req, res) {
    let dados = Token.getToken(req.cookies.token);
    res.render('admin_ped', {
        nome: dados.numeroValidacao.nomefantasia,
        email: dados.numeroValidacao.emailusuario,
        codrestaurante: dados.numeroValidacao.codrestaurante,
    })
});

router.get('/searchrest', (req, res) => {
    let endereco = JSON.parse(req.cookies.endereco);
    busca.buscaRestaurante(req.query.search, endereco[1]).then(rest => {
        busca.buscaProdutos(req.query.search).then(prods => {
            res.render('searchrest', {
                restaurantes: rest,
                produtos: prods
            });
        });
    });
});

router.get("/logout", (req, res) => {
    res.clearCookie('Token');
    res.end();
})

router.get("/page", (req, res) => {
    res.render("CriarConta")
});

router.get("/lista-restaurantes/:cidade", (req, res) => {
    restaurante.listarRestauranteCidade(req.params.cidade).then(function (data) {
        res.render("restaurantes", {
            rest: data
        });
    })
});

router.get("/lista-restaurantes/categoria/:categoria", (req, res) => {
    let endereco = JSON.parse(req.cookies.endereco);
    restaurante.listarRestauranteCategoria(req.params.categoria, endereco[1]).then(function (ti) {
        console.log(ti)
        res.render("restaurantes", {
            rest: ti
        });
    })
});

router.get("/lista-restaurantes/:cidade/:id", (req, res) => {
    res.render("restaurante", {
        codrestaurante: req.params.id
    });
});

router.get('/finalizarPedido', (req, res) => {
    if (req.cookies.tokenUsuario != undefined) {
        let dados = Token.getToken(req.cookies.tokenUsuario);
        usuario.listarEnderecosFront(dados.numeroValidacao.id).then(data => {
            res.render('finalizar', {
                data: data
            });
        })
    } else {
        res.redirect('/comeae');
    }
});

router.get("/cadastroCliente/:email", function (req, res) {
    let dados;
    if (req.cookies.user_new) {
        dados = Token.getToken(req.cookies.user_new);

        res.render('cadastroCliente', {
            email: req.params.email,
            name: dados.numeroValidacao.name,
            id: dados.numeroValidacao.id
        });
    } else {
        res.render('cadastroCliente', {
            email: req.params.email,

        });
    }

});

module.exports = router