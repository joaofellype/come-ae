const nodemailer = require('nodemailer');
const fs = require('fs');
const handlebars = require('handlebars');

const Mail  = require('../back/functions/mails');

module.exports={
    key:'CadastroUsuario',
    async handle({data}){
        const {user} =data;
        await  Mail.sendMail({
            from: 'process.env.SMTP_USER',
            to: user.emailusuario,
            subject: "Cadastro de senha",
            html: 'cadastro'
        })
    }
}
   