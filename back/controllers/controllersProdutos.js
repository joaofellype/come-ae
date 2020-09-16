const produtos = require('../model/Produtos');
const promocoes = require('../model/PromocoesRestaurantes');
const Sequelize = require("sequelize");
const db = require('../../config/database');
const localidades = require("../model/LocalidadesRestaurantes");
const sequelize = new Sequelize(db);
const categorias = require('../model/CategoriasProdutos');
const Token = require('../middleware/genereteToken')
module.exports = {
    async CadastrarProduto(req, res) {
        let dados = req.body;

        let errors;

        errors = req.validationErrors();



        req.assert(dados.campos.nome, 'Nome produto vazio').isEmpty();
        req.assert(dados.campos.idcateg, 'Categoria vazio').isEmpty();
        req.assert(dados.campos.preco, 'Preco vazio').isEmpty();
        parseFloat(dados.campos.preco.replace(',', '.'));
        if (errors) {
            res.status(400).json({
                acao: 'ERRO',
                validacao: errors
            });
        } else {
            console.log(dados)
            await produtos.create({
                nomeproduto: dados.campos.nome,
                codcategoria: dados.campos.idcateg,
                descricao: dados.campos.descricao,
                valor: parseFloat(dados.campos.preco.replace(',', '.')),
                codrestaurante: req.user.numeroValidacao.codrestaurante,
                adicionais: JSON.stringify(req.body.adicionais),
                codcriador: req.user.numeroValidacao.id,
                caminhofoto: dados.campos.fotocaminho.replace('/app', ''),
                stts: true
            }).then(function (data) {
                console.log(data)
                res.status(200).json({
                    message: 'Cadastrado com Sucesso'
                });
            }).catch(function (error) {
                console.log(error)
                res.status(400).json({
                    message: 'Erro ao cadastrar'
                });

            })
        }




    },
    async updateStatusProduto(req, res) {
        await produtos.update({
            status: req.body.status
        }, {
            where: {
                id: req.params.id
            }
        }).then(data => {
            res.status(200).json({
                message: 'Atualizado com sucesso'
            });
        }).catch(data => {
            res.status(400).json({
                message: 'Erro ao atualizar'
            });

        });
    },
    async listarProdutos(req, res) {
        const idCatedgoria = req.params.id;

        const produtos1 = await produtos.findAll({
            attributes: ['nomeproduto', 'id', 'status'],
            where: {
                codrestaurante: req.user.numeroValidacao.codrestaurante,
                codcategoria: idCatedgoria,
                stts: true
            }
        });
        if (produtos1 == null) {
            res.status(400).json({
                message: 'Nenhum Produto Foi encontrada'
            });

        } else {
            console.log(produtos1)
            res.json({
                data: produtos1
            });
        }
    },
    async listarProdutosRestaurantes(req, res) {

        const Produtos = await produtos.findAll({
            include: [{
                association: 'categoria',
                attributes: ['categoriaproduto']
            }],
            where: {
                codrestaurante: req.params.id,
                stts: true
            }

        });

        if (Produtos == null) {
            res.status(400).json({
                message: 'Nenhum Produto Foi encontrada'
            });
        }

        res.json(Produtos);
    },
    async listarProdutosCategoria(req, res) {
        const idCatedgoria = req.params.id;

        const produtos1 = await produtos.findAll({
            attributes: ['nomeproduto', 'id', 'valor'],
            where: {
                codrestaurante: req.user.numeroValidacao.codrestaurante,
                codcategoria: idCatedgoria
            }
        });
        if (produtos1 == null) {
            res.status(400).json({
                message: 'Nenhum Produto Foi encontrada'
            });

        } else {
            console.log(produtos1)
            res.json(produtos1);
        }
    },

    async listarAllProdutos(req, res) {

        const allProdutos = await produtos.findAll({
            where: {
                codrestaurante: req.user.dataValues.codrestaurante
            }
        }).catch(function (err) {
            res.status(500).json({
                message: 'Erro com a conexão com o banco'
            });
            console.log(err);
        });
        if (allProdutos == null) {
            res.status(400).json({
                message: 'Nenhum produto se encontra criado'
            });
        }
        res.json(allProdutos);
    },

    async listarEditar(req, res) {
        let id = req.params.id;
        const allProdutos = await produtos.findAll({
            include: [{
                association: 'categoria'
            }, {
                association: 'restaurante'
            }],
            where: {
                id: id
            }
        }).catch(function (err) {
            res.status(500).json({
                message: 'Erro com a conexão com o banco'
            });
            console.log(err);
        });
        if (allProdutos == null) {

            res.status(400).json({
                message: 'Nenhum produto se encontra criado'
            });
        }

        res.json(allProdutos);
    },
    async listarProdutoPromo(req, res) {

        const Produtos = await produtos.findAll({
            where: {
                codcategoria: req.params.codcategoria,
                codrestaurante: req.params.codrestaurante
            }
        });
        res.json(Produtos);
    },
    async listarProdutosUsu(req, res) {
        if (req.params.id == '40e6215d-b5c6-4896-987c-f30f3678f608') {
            let promo = await promocoes.findAll({
                include: [{
                    association: 'restaurante'
                }],
                where: {
                    codpromocao: req.params.id,
                    stts: true
                }
            });
            let ava = await sequelize.query('SELECT codrestaurante,avg(estrelas) as media, count(*) as total FROM "Avaliacoes"  GROUP BY codrestaurante;', {
                type: sequelize.QueryTypes.SELECT
            })
            let funcionamento = await sequelize.query('SELECT statusfuncionamento,codrestaurante FROM "StatusFuncionamentos"', {
                type: sequelize.QueryTypes.SELECT
            })
            let categoria = await sequelize.query('SELECT id,categoriarestaurante FROM "CategoriasRestaurantes"', {
                type: sequelize.QueryTypes.SELECT
            })
            res.json({
                promo: promo,
                ava: ava,
                funcionamento: funcionamento,
                categoria: categoria
            });
            return;
        }

        let locais = await localidades.findAll({
            include: [{
                association: 'restaurante',
                attributes: ['id']
            }],
            where: {
                cidade: 'São Luís',
                bairro: req.params.bairro
            }
        });
        let prod = [];
        prod.push(locais.map(async rest => {
            return await produtos.findOne({
                include: [{
                    association: 'restaurante',
                    where: {
                        id: rest.restaurante.id
                    }
                }],
                where: {
                    codpromocao: req.params.id,
                    statuspromocao: true
                }
            })

        }));
        let it = [];

        prod.forEach(async e => {
            for(let i=0;i<e.length;i++){
                console.log(await e[i])
                it.push(await e[i]);
                if(i < e.length-1){
                    console.log(it)
                    res.json(it);

                }

            }
        })


    },
    async listarProdutosRestaurante(req, res) {
        console.log('req.params.id  ')
        const categoria = await produtos.findAll({
            include: {
                association: 'categoria'
            },
            where: {
                codrestaurante: req.params.id
            }
        }).catch(err => {
            console.log(err)
        })


        console.log(categoria)

        res.json(categoria);
    },
    async UpdateProduto(req, res) {
        let id = req.params.id;
        let dados = req.body.campos;
        let errors;
        const now = new Date();
        now.setHours(now.getHours() - 3);
        req.assert(dados.nomeEdit, 'Nome produto vazio').isEmpty();
        req.assert(dados.iddesc, 'Categoria vazio').isEmpty();
        req.assert(dados.valorEdit, 'Preco vazio').isEmpty();
        errors = req.validationErrors();

        if (errors) {
            res.status(400).json({
                acao: 'ERRO',
                validacao: errors
            });
        } else {
            await produtos.update({
                nomeproduto: dados.nomeEdit,
                descricao: dados.descricaoEdit,
                valor: parseFloat(dados.valorEdit.replace(',', '.')),
                codcategoria: dados.codAdicional,
                caminho: dados.caminhofotoEditar,
                codupdate: req.user.numeroValidacao.id,
                updatedAt: now,
                adicionais: JSON.stringify(req.body.adicionais)
            }, {
                where: {
                    id: id
                }


            }).then(function (data) {
                res.status(200).json({
                    message: 'Atualizado com sucesso'
                });
            }).catch(function (error) {
                console.log(error)
                res.status(400).json({
                    message: 'Erro ao Atualizar',
                    err: error
                });
            });
        }
    },
    async DeleteGrupo(req, res) {
        let id = req.params.id;
        await produtos.update({
            stts: false
        }, {
            where: {
                id: id
            }
        }).then(function (data) {
            res.status(200).json({
                message: 'Deletado com sucesso'
            });
        }).catch(function (error) {
            res.status(400).json({
                message: 'Erro ao deletar'
            });
        })
    },

    async listarProdutosPromocao(req, res) {

        let Produtos = await produtos.findAll({
            where: {
                codpromocao: req.user.id
            }
        }).catch(err => {
            res.status(400).json({
                message: 'Não há produtos dentro dessa promocão'
            });
        })

        res.json(Produtos);
    }

}