const fs = require("fs");
const PDFDocument = require("pdfkit");

function createInvoice(invoice, path,data,gerado,nomerestaurante,tiporelatorio,dataInicial,dataFinal) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });

 
  generateInvoiceTable(doc, invoice);
  generateHeader(doc,data,gerado,nomerestaurante,tiporelatorio,dataInicial,dataFinal);
  doc.end();
  doc.pipe(fs.createWriteStream(path));
}


function generateHr(doc, y) {
    doc
      .strokeColor("#aaaaaa")
      .lineWidth(1)
      .moveTo(50, y)
      .lineTo(550, y)
      .stroke();
  }

  function generateInvoiceTable(doc, invoice) {
    let i;
    const invoiceTableTop = 260;
  
    doc.font("Helvetica-Bold");
    generateTableRow(
      doc,
      invoiceTableTop,
      "Quantidade",
      "referente",
      "Valor Total",
    );
    generateHr(doc, invoiceTableTop + 20);
    doc.font("Helvetica");
    console.log(invoice)
    for (i = 0; i < invoice.length; i++) {
     
      const item = invoice[i];
      const position = invoiceTableTop + (i + 1) * 30;
      generateTableRow(
        doc,
        position,
        item.quantidade,
        item.referente,
        item.valortotal,
    
      );
  
      generateHr(doc, position + 20);
    }

}

function generateTableRow(
    doc,
    y,
    quantidade,
    referente,
    valortotal,
 
  ) {
    doc
      .fontSize(10)
      .text(quantidade, 50, y)
      .text(referente, 150, y)
      .text(valortotal, 280, y, { width: 90, align: "right" });
      
  }
  function generateHeader(doc,data,gerado,nomerestaurante,tiporelatorio,dataInicial,dataFinal) {
    doc
      .image("views/img/logocompletaroxo.png", 50, 45, { width: 50 })
      .fillColor("#444444")
      .fontSize(20)
      .text(nomerestaurante,75,130,{align:'center'})
      .fontSize(15)
      .text(tiporelatorio,220,156)
      .fontSize(10)
      .text(`Data Referente: ${dataInicial} - ${dataFinal}`,300,200)
      .fontSize(10)
      .text(`Gerado por: ${gerado}`, 200, 65, { align: "right" })
      .text(`Gerado em: ${data}`, 200, 80, { align: "right" })
      .moveDown();
  }
  module.exports={createInvoice};