const dados = require('../back/controllers/relatorios');
const modelPdf = require('../back/utils/createPdf');
const moment = require('moment');



module.exports = {
    key: 'RelatorioFormaPagamentoAdmin',
    async handle({
        data
    }) {
        const {
            user
        } = data;

        let datas = {user};
        let now = new Date();
        let dataAtual=(moment(now).format('DD/MM/YYYY'));
        let path ='pdf/'+user.nome+'.pdf';
     
        dados.faturamentoPorDataAdmin({
            datas
        }).then(async dado => {
            modelPdf.createInvoice(dado,path,dataAtual,user.nomeUsuario,user.nomerestaurante,'Relatório Forma Pagamento');


        })



    }
}