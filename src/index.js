const express = require( 'express');
const dotenv  = require('dotenv');
const conn = require('./db/conn.js');
const Product = require('./models/Product.js');
const router = require('./routes/router.js');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger.json');

dotenv.config();

const app = express();

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(router);

conn
  //.sync({ force: true })
  .sync()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`runing => http://localhost:${process.env.PORT}`);
    })
  })
  .catch((err) => {
    console.log(chalk.bgRedBright.blackBright(`ERRO: ${err}`));
  });
