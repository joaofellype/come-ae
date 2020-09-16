const nodemailer = require('nodemailer');
const fs = require('fs');
const handlebars = require('handlebars');


module.exports = nodemailer.createTransport({

    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    requireTLS :true,
    tls:{
      rejectUnauthorized:true
    },
   service: "Gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
      
    },
  });
  

