const puppuetter = require('puppeteer');
const fs = require('fs-extra');
const hbs = require("handlebars");
const path = require('path');
const moment = require("moment");
const data = require('./back/controllers/relatorios');
const compile = async function(templateName, {dados}){
    console.log(dados)
    const filePath = path.join(process.cwd(),'templates', `${templateName}.hbs`);
    const html = await fs.readFile(filePath,'utf-8');
     
    return hbs.compile(html)({dados});
};

hbs.registerHelper('dateFormat',function(value,format){
    console.log('formating',value,format);

    return moment(value).format(format)
});

(async function(){

    try{

        const browser = await puppuetter.launch();
        const page  = await browser.newPage();

        data.faturamentoPorData().then(async dados=>{
            const content = await compile('shot-list',{dados})
            
                console.log(content)
           
            await page.setContent(content);
            await page.emulateMediaType('screen');
            await page.pdf({
                path:'mypdf.pdf',
                format:'A4',
                printBackground:true
            });
            console.log('FOI');
            await page.close();
    
            process.exit();
        })
    }catch(e){
        console.log(e);
    }
})();