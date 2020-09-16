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
    key: 'RecuperarSenha',
    async handle({
        data
    }) {
        const {
            user
        } = data;
        let mailOptions;
      console.log(user)
        let link = 'https://comeaee.herokuapp.com/redefinirSenha/' + user.emailusuario + '/' + user.token;
        readHTMLFile('./views/page_recover.html', async function (err, html) {
            var template = handlebars.compile(html);
            var replacements = {
                link: link
            };

            var htmlToSend = template(replacements)

             mailOptions = {
                from: 'process.env.SMTP_USER',
                to: user.emailusuario,
                subject: "Redefinição de senha",
                html: htmlToSend
            }
                await Mail.sendMail(mailOptions)
        })

    
    }
}