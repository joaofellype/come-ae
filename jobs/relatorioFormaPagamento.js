
const moment = require('moment');
const dados = require('../back/controllers/relatorios');
const modelPdf = require('../back/utils/createPdf');

module.exports={
    key:'RelatorioFormaPagamento',
    async handle({data}){
        const {user} = data;  
       
     
       
        let datas = {user};
        let now = new Date();
        let dataAtual=(moment(now).format('DD/MM/YYYY'));
        
        let path ='pdf/'+user.nome+'.pdf';
        dados.faturamentoPorData({datas}).then(async dado=>{
            console.log(dado)
            modelPdf.createInvoice(dado,path,dataAtual,user.nomeUsuario,user.nomerestaurante,'Relatório Forma Pagamento',moment(user.dataInicial,'DD/MM/YYYY'),moment(user.dataFinal,'DD/MM/YYYY' ));

        
                
        })
  

       
    }
}
   