
const moment = require('moment');
const dados = require('../back/controllers/relatorios');
const modelPdf = require('../back/utils/createPdf');

module.exports={
    key:'RelatoriosProdutosMais',
    async handle({data}){
        const {user} = data;  
       
       
       
        let datas = {user};
        let now = new Date();
        let dataAtual=(moment(now).format('DD/MM/YYYY'));
        let path ='pdf/'+user.nome+'.pdf';
        dados.relatorioProdutosMaisVendidos({datas}).then(async dado=>{
            
            modelPdf.createInvoice(dado,path,dataAtual,user.nomeUsuario,user.nomerestaurante,'Relatório Produtos Mais Vendidos');
  
        })

    }
}
   