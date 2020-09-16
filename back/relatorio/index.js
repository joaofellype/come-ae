const puppuetter = require('puppeteer');
const fs = require('fs-extra');

(async function(){

    try{

        const browser = await puppuetter.launch();
        const page  = await browser.newPage();

        await page.setContent('<h1>TESTANDO GERANÇÃO DE RELATORIO </h1>');
        await page.emulateMediaType('screen');
        await page.pdf({
            path:'mypdf.pdf',
            format:'A4',
            printBackground:true
        });
        console.log('FOI');
        await page.close();

        process.exit();
    }catch(e){
        console.log(e);
    }
})();