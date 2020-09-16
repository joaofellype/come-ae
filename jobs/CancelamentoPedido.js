const nodemailer = require('nodemailer');
const fs = require('fs');
const handlebars = require('handlebars');

const Mail  = require('../back/functions/mails');
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
module.exports={
    key:'CancelarPedido',
    async handle({data}){
        const {user} =data;
        
        console.log(user)
        readHTMLFile('./views/page_pedido_cancelado.html', async function (err, html) {
        
            var template = handlebars.compile(html);
            var replacements = {
              nomeusuario: user.nomeusuario,
              motivo: user.motivo
            };
    
            var htmlToSend = template(replacements)
         
            mailOptions1 = {
              from: 'process.env.SMTP_USER',
              to: user.emailusuario,
              subject: "Cancelamento do Pedido",
              html: htmlToSend
            }
            await Mail.sendMail(mailOptions1);
      
      })
        
    }
}
   