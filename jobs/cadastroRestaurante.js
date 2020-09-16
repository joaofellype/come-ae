const fs = require('fs');
const handlebars = require('handlebars');

const Mail = require('../back/functions/mails');
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
module.exports = {
    key: 'CadastroRestaurante',
    async handle({
        data
    }) {
        const {
            user
        } = data;
   
        var mailOptions1;
        console.log(user)
        readHTMLFile('./views/page_analyze.html', async function (err, html) {
          var template = handlebars.compile(html);
          var replacements = {
            nomeusuario: user.nomeDono,
          };
  
          var htmlToSend = template(replacements)
  
          mailOptions1 = {
            from: 'process.env.SMTP_USER',
            to: user.emailDono,
            subject: "Aprovação cadastro Comeaê",
            html: htmlToSend
          }
  
         
          await Mail.sendMail(mailOptions1);

        });
    
    }
}