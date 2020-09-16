const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const autentic = require('../../controllers/criptografia')
const db = require('../../controllers/dbconfig')
const fs = require('fs')
require('dotenv').config()
const  handlebars = require('handlebars');


var smtpTransport = nodemailer.createTransport({

    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,

    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    },
});
var readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
}; 
async function enviarEmail(req,res){
    var id
    var mailOptions1, link1
    const {
        login
    } = req.body
    console.log("OK: " + login)
    const text = 'SELECT idusuario , emailusuario,senhausuario from usuariosrestaurante where emailusuario =$1'
    try {
        const {
            rows
        } = await db.pool.query(text, [login])
        if (!rows[0]) {
            res.status(400).send({message:'Email não encontrado'})
            res.end();
        }
        else{

        let dados = rows[0]
        let token = autentic.generateToken(dados.idusuario)
        db.pool.query('UPDATE usuariosrestaurante SET tokenrecuperacao=$1 WHERE idusuario =$2', [token, dados.idusuario])
        host = req.get('host');
        link1 = "http://" + req.get('host') + "/verificar-email/" + token;

        readHTMLFile(__dirname + '/../../views/page_recover.html', function(err, html) {
            var template = handlebars.compile(html);
            var replacements = {
                 link: link1
            };

            var htmlToSend = template(replacements)

        mailOptions1 = {
            from: 'comeae@andlima.com.br',
            to: login,
            subject: "Recuperação de senha", 
           html:htmlToSend
        }
       
        smtpTransport.sendMail(mailOptions1, function (error, response) {
            if (error) {
                console.log(error);
                response.status(200).send("error");
            } else {
               
                console.log("Email enviado!");
                res.status(200).send({message: 'Email enviado!<br><br>O email pode demorar alguns minutos para chegar, por favor, verifique também a sua caixa de SPAM'})
               
            }
        });
        
    });
}
    } catch (error) {
        console.log(error)
    }
}

module.exports={
    enviarEmail
}