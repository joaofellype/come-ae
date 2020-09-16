const Avaliacao = require("../model/Avaliacoes");
const uuid = require('uuid');
const Sequelize = require("sequelize");
const db = require('../../config/database');
const sequelize = new Sequelize(db);
module.exports = {

    async createAvaliacoes(req, res) {

        let dados = req.body;

        await Avaliacao.create({
            id: uuid.v4(),
            estrelas: dados.nota,
            avaliacao: dados.comentario,
            codpedido: dados.pedido,
            codusuario: req.user.numeroValidacao.id,
            codrestaurante: dados.restaurante
        }).then(dados => {

            res.status(200).json({
                message: 'Avaliado com sucesso'
            });
        }).catch(err => {
            console.log(err);
            res.status(401).json({
                message: 'Erro ao avaliar'
            });
        })
    },
    async listarAvaliacao(req, res) {

        let paginacao = parseInt(req.params.pagina);
        let ava = await Avaliacao.findAll({
            include: [{
                association: 'usuario'
            }],
            where: {
                codrestaurante: req.params.id
            },
            offset: paginacao,
            limit: 3,
            order: [
                ["createdAt", 'DESC']
            ]
        });

        res.json({
            ava: ava,
            pagina: paginacao + 3
        });
    },

    async listarAvaliacaoRestaurante(req, res) {
        let dataInicial = req.params.dataInicial;
        let dataFinal = req.params.dataFinal;

        let avaliacoes = await sequelize.query('SELECT ava.estrelas, ava.avaliacao,usua.nomeusuario,ped.produtos' +
            'from "Avaliacoes" as ava inner join "Usuarios" usua on ava.codusuario =' +
            'usua.id inner join "Pedidos" ped on ava.codpedido = ped.id WHERE ava."createdAt" between ? and ? AND ava."codrestaurante"=?', {
                replacements: [dataInicial, dataFinal, req.user.numeroValidacao.codrestaurante],
                type: sequelize.QueryTypes.SELECT
            });
        res.json(avaliacoes);
    },

    async listarQuantidadesAvaRestaurante(req, res) {

        let avaliacoes1 = await sequelize.query('SELECT COUNT(*) as quantidades from "Avaliacoes" WHERE estrelas =1 and codrestaurante = ?', {
            replacements: [req.user.numeroValidacao.codrestaurante],
            type: sequelize.QueryTypes.SELECT
        });

        let avaliacoes2 = await sequelize.query('SELECT COUNT(*) as quantidades from "Avaliacoes" WHERE estrelas = 2 and codrestaurante = ?', {
            replacements: [req.user.numeroValidacao.codrestaurante],
            type: sequelize.QueryTypes.SELECT
        });

        let avaliacoes3 = await sequelize.query('SELECT COUNT(*) as quantidades from "Avaliacoes" WHERE estrelas = 3 and codrestaurante = ?', {
            replacements: [req.user.numeroValidacao.codrestaurante],
            type: sequelize.QueryTypes.SELECT
        });

        let avaliacoes4 = await sequelize.query('SELECT COUNT(*) as quantidades from "Avaliacoes" WHERE estrelas = 4 and codrestaurante = ?', {
            replacements: [req.user.numeroValidacao.codrestaurante],
            type: sequelize.QueryTypes.SELECT
        });

        let avaliacoes5 = await sequelize.query('SELECT COUNT(*) as quantidades from "Avaliacoes" WHERE estrelas = 5 and codrestaurante = ?', {
            replacements: [req.user.numeroValidacao.codrestaurante],
            type: sequelize.QueryTypes.SELECT
        });

        res.json({
            avaliacoes1: avaliacoes1,
            avaliacoes2: avaliacoes2,
            avaliacoes3: avaliacoes3,
            avaliacoes4: avaliacoes4,
            avaliacoes5: avaliacoes5
        });
    },
    async listarAvaliacoesMes(req, res) {

        let janeiro = await sequelize.query('select count(*) from "Avaliacoes" where "createdAt" >= ?::DATE ' + 'and "createdAt" <= ?::DATE  and codrestaurante = ?', {
            replacements: ['2020-01-01', '2020-01-30' ,req.user.numeroValidacao.codrestaurante],
            type: sequelize.QueryTypes.SELECT
        });
        let fevereiro = await sequelize.query('select count(*) from "Avaliacoes" where "createdAt" >= ?::DATE ' + 'and "createdAt" <= ?::DATE and codrestaurante = ?', {
            replacements: ['2020-02-01', '2020-02-28',req.user.numeroValidacao.codrestaurante],
            type: sequelize.QueryTypes.SELECT
        });
        let marco = await sequelize.query('select count(*) from "Avaliacoes" where "createdAt" >= ?::DATE ' + 'and "createdAt" <= ?::DATE and codrestaurante = ?', {
            replacements: ['2020-03-01', '2020-03-30',req.user.numeroValidacao.codrestaurante],
            type: sequelize.QueryTypes.SELECT
        });
        let abril = await sequelize.query('select count(*) from "Avaliacoes" where "createdAt" >= ?::DATE ' + 'and "createdAt" <= ?::DATE and codrestaurante = ?', {
            replacements: ['2020-04-01', '2020-04-30',req.user.numeroValidacao.codrestaurante],
            type: sequelize.QueryTypes.SELECT
        });
        let maio = await sequelize.query('select count(*) from "Avaliacoes" where "createdAt" >= ?::DATE ' + 'and "createdAt" <= ?::DATE and codrestaurante = ?', {
            replacements: ['2020-05-01', '2020-05-30',req.user.numeroValidacao.codrestaurante],
            type: sequelize.QueryTypes.SELECT
        });
        let junho = await sequelize.query('select count(*) from "Avaliacoes" where "createdAt" >= ?::DATE ' + 'and "createdAt" <= ?::DATE and codrestaurante = ?', {
            replacements: ['2020-06-01', '2020-06-30',req.user.numeroValidacao.codrestaurante],
            type: sequelize.QueryTypes.SELECT
        });
        let julho = await sequelize.query('select count(*) from "Avaliacoes" where "createdAt" >= ?::DATE ' + 'and "createdAt" <= ?::DATE and codrestaurante = ?', {
            replacements: ['2020-07-01', '2020-07-30',req.user.numeroValidacao.codrestaurante],
            type: sequelize.QueryTypes.SELECT
        });
        let agosto = await sequelize.query('select count(*) from "Avaliacoes" where "createdAt" >= ?::DATE ' + 'and "createdAt" <= ?::DATE and codrestaurante = ?', {
            replacements: ['2020-08-01', '2020-08-30',req.user.numeroValidacao.codrestaurante],
            type: sequelize.QueryTypes.SELECT
        });
        let setembro = await sequelize.query('select count(*) from "Avaliacoes" where "createdAt" >= ?::DATE ' + 'and "createdAt" <= ?::DATE and codrestaurante = ?', {
            replacements: ['2020-09-01', '2020-09-30',req.user.numeroValidacao.codrestaurante],
            type: sequelize.QueryTypes.SELECT
        });
        let outubro = await sequelize.query('select count(*) from "Avaliacoes" where "createdAt" >= ?::DATE ' + 'and "createdAt" <= ?::DATE and codrestaurante = ?', {
            replacements: ['2020-10-01', '2020-10-30',req.user.numeroValidacao.codrestaurante],
            type: sequelize.QueryTypes.SELECT
        });
        let novembro = await sequelize.query('select count(*) from "Avaliacoes" where "createdAt" >= ?::DATE ' + 'and "createdAt" <= ?::DATE and codrestaurante = ?', {
            replacements: ['2020-11-01', '2020-11-30',req.user.numeroValidacao.codrestaurante],
            type: sequelize.QueryTypes.SELECT
        });
        let dezembro = await sequelize.query('select count(*) from "Avaliacoes" where "createdAt" >= ?::DATE ' + 'and "createdAt" <= ?::DATE and codrestaurante = ?', {
            replacements: ['2020-12-01', '2020-12-30',req.user.numeroValidacao.codrestaurante],
            type: sequelize.QueryTypes.SELECT
        });



        res.json({janeiro:janeiro,fevereiro:fevereiro,marco:marco,abril:abril,maio:maio,junho:junho,julho:julho,agosto:agosto,setembro:setembro,outubro:outubro,novembro:novembro,dezembro:dezembro
        });
    },

    async listarAvaliacaoComentario(req, res) {

        let avaliacoes = await Avaliacao.findAll({
            include: [{
                association: 'restaurante'
            }, {
                association: 'usuario'
            }, {
                association: 'pedido'
            }],
            attributes: ['estrelas', 'avaliacao', 'createdAt'],where:{codrestaurante:req.user.numeroValidacao.codrestaurante}
        });

        res.json(avaliacoes);
    },
    async listarMediaAvaliacoes(req,res){


        let ava = await sequelize.query('SELECT codrestaurante,avg(estrelas) as media, count(*) as total FROM "Avaliacoes"  WHERE codrestaurante=?  GROUP BY codrestaurante;', { replacements: [req.user.numeroValidacao.codrestaurante], type: sequelize.QueryTypes.SELECT });

        res.json(ava);
    }



}