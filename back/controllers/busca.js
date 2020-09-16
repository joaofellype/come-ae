const restaurante = require('../model/Restaurantes');
const produtos = require('../model/Produtos');
const categoriaRestaurante = require("../model/CategoriasRestaurantes");
const statusFuncionamento = require('../model/StatusFuncionamentos');
require('dotenv').config();
const Sequelize = require('sequelize');
const db = require('../../config/database');
const sequelize = new Sequelize(db);
const Pool = require('pg').Pool
const pool = new Pool({
    user: process.env.DB_USUARIO,
    host: process.env.DB_HOST,
    database: process.env.DB_BASE,
    password: process.env.DB_SENHA,
    ssl: true,
    port: 5432,
})

module.exports = {

    async buscaRestaurante(req, res) {

        const Op = Sequelize.Op;

        var query = `%${req.params.query}%`;
        let array = [];

        let Restaurantes = await restaurante.findAll({
            include: [{
                association: 'endereco',
                attributes: ['cidade'],
                where: {
                    cidade: 'São Luís'
                }
            }, {
                association: 'categoria',
            }, {
                association: 'funcionamento'
            }],
            where: {
                nomefantasia: {
                    [Op.iLike]: query
                },
                status: true

            }
        }).catch(err => {
            console.log(err)
        });

    
     
        let Restaurantes1 = await restaurante.findAll({
            include: [{
                association: 'endereco',
                attributes: ['cidade'],
                where: {
                    cidade: 'São Luís'
                }
            }, {
                association: 'categoria',where:{ categoriarestaurante:{[Op.iLike]: query}}
            }, {
                association: 'funcionamento'
            }],
            where: {
                status: true

            }
        }).catch(err => {
            console.log(err)
        });

    
        let ava = await sequelize.query('SELECT codrestaurante,avg(estrelas) as media, count(*) as total FROM "Avaliacoes"  GROUP BY codrestaurante;', {
            type: sequelize.QueryTypes.SELECT
        });
        array = Restaurantes.concat(Restaurantes1);
    
        res.json({
            Restaurantes: array,
            avaliacao: ava
        })
    },
    async buscarProdutosRestaurante(req, res) {
        let array = []
        let Restaurantes = await restaurante.findAll({
            attributes: ['nomefantasia', 'caminhofoto']
        }).catch(err => {
            console.log(err)
        });

        let Produtos = await produtos.findAll({
            attributes: ['caminhofoto', ['nomeproduto', 'nomefantasia']]
        }).catch(err => {
            console.log(err)
        });
        array = Produtos.concat(Restaurantes);
        res.json(array);
    },

    async buscaProdutos(req, res) {

        const Op = Sequelize.Op;
        var query = `%${req.params.query}%`;

        let Produtos = await produtos.findAll({
            include: [{
                association: 'restaurante'
            }],
            where: {
                nomeproduto: {
                    [Op.iLike]: query
                }
            }
        }).catch(err => {
            console.log(err)
        });
        let categorias = await categoriaRestaurante.findAll({
            attributes: ['id', 'categoriarestaurante']
        });
 
        
        res.json({
            Produtos: Produtos,
            categoria: categorias,
     
         
        });

    },

    async funcaoPromocao(valor) {
        let array = [4, 5];
        let valores = [35.00, 20.00];
        let a = [4, 5, 6, 7];
        let b = [10, 11, 12, 13];

        for (let i = 0; i < a.length; i++) {
            console.log(a[i]);
            console.log(b[i]);
        }
        await pool.query('SELECT alterarpromocao($1,$2,$3)', [array, valores, valor], (error, results) => {
            if (error) {
                throw error
            }

            console.log(results)
        })
    }

}