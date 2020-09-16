const dados = require('../back/controllers/relatorios');
const modelPdf = require('../back/utils/createPdf');
const moment = require('moment');



module.exports={
    key:'RelatoriosBairros',
    async handle({data}){
        const {user} = data;  
        let datas = {user};
        let now = new Date();
        let dataAtual=(moment(now).format('DD/MM/YYYY'));
        let path ='pdf/'+user.nome+'.pdf';
     
        dados.relatorioBairro({datas}).then(async dado=>{
            console.log(dado);
            modelPdf.createInvoice(dado,path,dataAtual,user.nomeUsuario,user.nomerestaurante,'Relatório Bairro');

       
                
        })
  


       
    }
}
   