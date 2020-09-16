let Queue = require('../../Queue/Queue');
const Sequelize = require("sequelize");
const db = require('../../config/database');

const sequelize = new Sequelize(db);

module.exports = {

    async fatura(req, res) {


        await Queue.cadastroQueue.add({
            user
        }, {
            delay: 100000
        });
        res.status(200).json({
            message: 'ssslkslk'
        })
    },
    async faturamentoPorData({
        datas
    }) {
        //  console.log(req.query.dataInicial);
        // et dataInicial = req.query.dataInicial;
        //  let dataFinal = req.query.dataFinal;
        console.log(datas)

        let contas = await sequelize.query('SELECT  count(*) as quantidade, formapagamento as referente,SUM (valor) as valortotal FROM "Pedidos" WHERE codrestaurante=? and "createdAt" between ? and ? GROUP BY formapagamento', {
            replacements: [datas.user.codrestaurante, datas.user.dataInicial, datas.user.dataFinal],
            type: sequelize.QueryTypes.SELECT
        });


        //res.json(contas);
        return contas
    },
    async relatorioBairro({
        datas
    }) {



        let contas = await sequelize.query('SELECT count(ped.id) as quantidade,ende.bairro as referente,sum(ped.valor) as valortotal from "Pedidos" ped INNER JOIN "EnderecosUsuarios" ende on ped.codendereco = ende.id WHERE codrestaurante=? and ped."createdAt" BETWEEN ? and ?  GROUP BY ende.bairro order by quantidade desc', {
            replacements: [datas.user.codrestaurante, datas.user.dataInicial, datas.user.dataFinal],
            type: sequelize.QueryTypes.SELECT
        });

        return contas
    },
    async relatorioProdutosMaisVendidos({
        datas
    }) {



        let contas = await sequelize.query('Select  count(rel.id) as quantidade ,prod.nomeproduto as referente ,sum(rel.valorproduto) as valortotal from "RelatoriosProdutos" rel inner join "Produtos" prod on rel.codproduto = prod.id where rel.codrestaurante=? and rel."createdAt" BETWEEN ? AND ? GROUP BY prod.nomeproduto  order by quantidade desc limit 20;', {
            replacements: [datas.user.codrestaurante, datas.user.dataInicial, datas.user.dataFinal],
            type: sequelize.QueryTypes.SELECT
        });

        return contas

    },
    async relatorioProdutosMenosVendidos({
        datas
    }) {

        let contas = await sequelize.query('Select  count(rel.id) as quantidade ,prod.nomeproduto as referente ,sum(rel.valorproduto) as valortotal from "RelatoriosProdutos" rel inner join "Produtos" prod on rel.codproduto = prod.id where rel.codrestaurante=? and rel."createdAt" BETWEEN ? AND ? GROUP BY prod.nomeproduto  order by quantidade asc limit 20;', {
            replacements: [datas.user.codrestaurante, datas.user.dataInicial, datas.user.dataFinal],
            type: sequelize.QueryTypes.SELECT
        });

        return contas

    },
  
    async relatorioTurno({datas}) {

        let dataInicialManha = datas.user.dataInicial + ':06:00:00';
        let dataFinalManha = datas.user.dataFinal + ':12:00:00';

        let dataInicialTarde = datas.user.dataInicial + ':12:00:00';
        let dataFinalTarde = datas.user.dataFinal + ':18:00:00';

        let dataInicialNoite = datas.user.dataInicial + ':18:00:00';
        let dataFinalNoite = datas.user.dataFinal + ':05:00:00';
        
        let manha = await sequelize.query(`SELECT 'Manha' as referente,  count(*) as quantidade, sum(valor) as valortotal FROM "Pedidos" WHERE codrestaurante=? and "createdAt" between ? 
             and ?  GROUP BY codrestaurante`, {
                replacements: [datas.user.codrestaurante, dataInicialManha, dataFinalManha],
                type: sequelize.QueryTypes.SELECT
            });
        let tarde = await sequelize.query(`SELECT 'Tarde' as referente,  count(*) as quantidade, sum(valor) as valortotal FROM "Pedidos" WHERE codrestaurante=? and "createdAt" between ? 
             and ?  GROUP BY codrestaurante`, {
                replacements: [datas.user.codrestaurante, dataInicialTarde, dataFinalTarde],
                type: sequelize.QueryTypes.SELECT
            });
        let noite = await sequelize.query(`SELECT 'Noite' as referente, count(*) as quantidade, sum(valor) as valortotal FROM "Pedidos" WHERE codrestaurante=? and "createdAt" between ? 
             and ?  GROUP BY codrestaurante`, {
                replacements: [datas.user.codrestaurante, dataInicialNoite, dataFinalNoite],
                type: sequelize.QueryTypes.SELECT
            });

            //let array =[{manha:manha[0],tarde:tarde[0],noite:noite[0]}];
            let array=[];
            array.push(manha[0])
            array.push(tarde[0])
            array.push(noite[0]);
            console.log(array)
        return array;

    },
    

    async faturamentoPorDataAdmin({
        datas
    }) {


        let contas = await sequelize.query('SELECT  count(*) as quantidade, formapagamento as referente,SUM (valor) as valortotal FROM "Pedidos" WHERE codrestaurante=? and "createdAt" between  ? and  ? GROUP BY formapagamento', {
            replacements: [datas.user.codrestaurante, datas.user.dataInicial, datas.user.dataFinal],
            type: sequelize.QueryTypes.SELECT
        });

        return contas

    },
    async relatorioBairroAdmin({
        datas
    }) {



        let contas = await sequelize.query('SELECT count(ped.id) as quantidade,ende.bairro as referente,sum(ped.valor) as valortotal from "Pedidos" ped INNER JOIN "EnderecosUsuarios" ende on ped.codendereco = ende.id WHERE codrestaurante=? and ped."createdAt" BETWEEN ? and ?  GROUP BY ende.bairro', {
            replacements: [datas.user.codrestaurante, datas.user.dataInicial, datas.user.dataFinal],
            type: sequelize.QueryTypes.SELECT
        });

        return contas


    },
    async relatorioProdutosMaisVendidosAdmin({
        datas
    }) {


        let contas = await sequelize.query('Select  count(rel.id) as quantidade ,prod.nomeproduto as referente ,sum(rel.valorproduto) as valortotal from "RelatoriosProdutos" rel inner join "Produtos" prod on rel.codproduto = prod.id where rel.codrestaurante=? and rel."createdAt" BETWEEN ? AND ? GROUP BY prod.nomeproduto  order by quantidade desc limit 20;', {
            replacements: [datas.user.codrestaurante, datas.user.dataInicial, datas.user.dataFinal],
            type: sequelize.QueryTypes.SELECT
        });


        return contas

    },
    async relatorioProdutosMenosVendidosAdmin({
        datas
    }) {



        let contas = await sequelize.query('Select  count(rel.id) as quantidade ,prod.nomeproduto as referente ,sum(rel.valorproduto) as valortotal from "RelatoriosProdutos" rel inner join "Produtos" prod on rel.codproduto = prod.id where rel.codrestaurante=? and rel."createdAt" BETWEEN ? AND ? GROUP BY prod.nomeproduto  order by quantidade asc limit 20;', {
            replacements: [datas.user.codrestaurante, datas.user.dataInicial, datas.user.dataFinal],
            type: sequelize.QueryTypes.SELECT
        });


        return contas

    },

    async faturamentoTudo(req, res) {



        let contas = await sequelize.query('SELECT  count(*) as quantidade, formapagamento as referente,SUM (valor) as valortotal FROM "Pedidos" WHERE codrestaurante=?   GROUP BY formapagamento', {
            replacements: [req.user.numeroValidacao.codrestaurante],
            type: sequelize.QueryTypes.SELECT
        });


        res.json(contas);

    },
    async relatorioBairroTudo(req, res) {



        let contas = await sequelize.query('SELECT count(ped.id) as quantidade,ende.bairro as referente,sum(ped.valor) as valortotal from "Pedidos" ped INNER JOIN "EnderecosUsuarios" ende on ped.codendereco = ende.id WHERE codrestaurante=?  GROUP BY ende.bairro', {
            replacements: [req.user.numeroValidacao.codrestaurante],
            type: sequelize.QueryTypes.SELECT
        });

        res.json(contas);

    },
    async relatorioProdutosMaisVendidosTudo(req, res) {



        let contas = await sequelize.query('Select  count(rel.id) as quantidade ,prod.nomeproduto as referente ,sum(rel.valorproduto) as valortotal from "RelatoriosProdutos" rel inner join "Produtos" prod on rel.codproduto = prod.id where rel.codrestaurante=? GROUP BY prod.nomeproduto  order by quantidade desc limit 20;', {
            replacements: [req.user.numeroValidacao.codrestaurante],
            type: sequelize.QueryTypes.SELECT
        });


        res.json(contas);

    },
    async relatorioProdutosMenosVendidosTudo(req, res) {

        let contas = await sequelize.query('Select  count(rel.id) as quantidade ,prod.nomeproduto as referente ,sum(rel.valorproduto) as valortotal from "RelatoriosProdutos" rel inner join "Produtos" prod on rel.codproduto = prod.id where rel.codrestaurante=? GROUP BY prod.nomeproduto  order by quantidade asc limit 20;', {
            replacements: [req.user.numeroValidacao.codrestaurante],
            type: sequelize.QueryTypes.SELECT
        });

        res.json(contas);

    },


    async faturamentoEspecifico(req, res) {

        let dataInicial = req.query.dataInicial;


        let contas = await sequelize.query('SELECT  count(*) as quantidade, formapagamento as referente,SUM (valor) as valortotal FROM "Pedidos" WHERE codrestaurante=? and "c   GROUP BY formapagamento', {
            replacements: [req.user.numeroValidacao.codrestaurante, dataInicial],
            type: sequelize.QueryTypes.SELECT
        });

        res.json(contas);

    },
    async relatorioBairroeEspecifico(req, res) {

        let dataInicial = req.query.dataInicial;


        let contas = await sequelize.query('SELECT count(ped.id) as quantidade,ende.bairro as referente,sum(ped.valor) as valortotal from "Pedidos" ped INNER JOIN "EnderecosUsuarios" ende on ped.codendereco = ende.id WHERE codrestaurante=? and ped."createdAt" =? GROUP BY ende.bairro', {
            replacements: [req.user.numeroValidacao.codrestaurante, dataInicial],
            type: sequelize.QueryTypes.SELECT
        });


        res.json(contas);

    },
    async relatorioProdutosMaisVendidosEspecifico(req, res) {

        let dataInicial = req.query.dataInicial;


        let contas = await sequelize.query('Select  count(rel.id) as quantidade ,prod.nomeproduto as referente ,sum(rel.valorproduto) as valortotal from "RelatoriosProdutos" rel inner join "Produtos" prod on rel.codproduto = prod.id where rel.codrestaurante=? and rel."createdAt =? GROUP BY prod.nomeproduto  order by quantidade desc limit 20;', {
            replacements: [req.user.numeroValidacao.codrestaurante, dataInicial],
            type: sequelize.QueryTypes.SELECT
        });


        res.json(contas);

    },
    async relatorioProdutosMenosVendidosEspecifico(req, res) {

        let dataInicial = req.query.dataInicial;


        let contas = await sequelize.query('Select  count(rel.id) as quantidade ,prod.nomeproduto as referente ,sum(rel.valorproduto) as valortotal from "RelatoriosProdutos" rel inner join "Produtos" prod on rel.codproduto = prod.id where rel.codrestaurante=? and rel."createdAt" =? GROUP BY prod.nomeproduto  order by quantidade asc limit 20;', {
            replacements: [req.user.numeroValidacao.codrestaurante, dataInicial],
            type: sequelize.QueryTypes.SELECT
        });


        res.json(contas);

    },


}