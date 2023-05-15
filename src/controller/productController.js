const Product = require('../models/Product.js');
const PdfPrinter = require('pdfmake');
const fs = require('fs');

const show = async (req, res) => {
  const products = await Product.findAll();
  return res.status(200).json(products);
}

const details = async (req, res) => {
  const { id } = req. params;
  const product = await Product.findOne({
    where: {
      id: id
    }
  });
  return res.status(200).json(product);
}

const productsReport = async (req, res) => {
  const products = await Product.findAll();

  const fonts = {
    Helvetica: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      italics: "Helvetica-Oblique",
      bolditalics: "Helvetica-BoldOblique"
    }
  }
  const printer = new PdfPrinter(fonts);

  const body = [];

  for await (let product of products) {
    const rows = new Array();
    
    rows.push(product.name)
    rows.push(product.description)
    rows.push(`R$ ${product.price.toFixed(2)}`)
    rows.push(product.quantity)

    body.push(rows);
  }

  const docDefinitions = {
    defaultStyle: {
      font: "Helvetica"
    },
    content: [
      {
        columns: [
          {
            text: "Relatório de Produtos",
            style: "header"
          },
          {
            text: "14/05/2023 12:18\n\n",
            style: "header"
          }
        ]
      },
      {
        table: {
          heights: function(row) {
            return 20
          },
          widths: [
            'auto',
            140,
            60,
            'auto'
          ],
          body: [
            [
              {
                text:"Nome",
                style: "columnsTitle" 
              },
              {
                text:"Descrição",
                style: "columnsTitle" 
              },
              {
                text:"Preço",
                style: "columnsTitle" 
              },
              {
                text:"Quantidade",
                style: "columnsTitle" 
              },
            ],
            ...body
          ]
        }
      }
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: "center"
      },
      columnsTitle: {
        fontSize: 13,
        bold: true,
        fillColor: "#3498db",
        color: "#fff",
        alignment: "center",
        margin: 4
      }
    }
  }

  const pdfDoc = printer.createPdfKitDocument(docDefinitions);

  //pdfDoc.pipe(fs.createWriteStream("Relatorio.pdf"));

  const chunks = [];

  pdfDoc.on("data", (chunk) => {
    chunks.push(chunk);
  })
  
  pdfDoc.end();
  
  pdfDoc.on("end", () => {
    const result = Buffer.concat(chunks)
    res.end(result);
  })

}

const create = async (req, res) => {
  const { name, description, price, quantity } = req.body;
  
  try {
    const product = {
      name,
      description,
      price,
      quantity
    }

    const productExist = await Product.findOne({
      where: {
        name: name
      }
    });

    if(productExist) {
      return res.status(400).json({ message: "Produto já existe" });
    }
  
    await Product.create(product);
    return res.status(201).json({ message: 'Produto criado com sucesso!' });

  } catch (error) {
    console.log(error);
  }
}

const edit = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, quantity } = req.body;

  try {
    const product = {
      name,
      description,
      price,
      quantity
    }

    await Product.update(product, {
      where: {
        id: id
      }
    });

    return res.status(200).json({ message: 'Produto editado com sucesso!' });

  } catch (error) {
    console.log(error);
  }
}

const remove = async (req, res) => {
  const { id } = req.params;

  try {

    await Product.destroy({
      where: {
        id: id
      }
    });

    return res.status(200).json({ message: 'Produto removido com sucesso!' });

  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  show,
  details,
  productsReport,
  create,
  edit,
  remove
}