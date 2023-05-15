const { Sequelize } = require('sequelize'); 'sequelize';
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(process.env.BD, 'root', '', {
  host: process.env.HOST,
  dialect: 'mysql'
});

try {
  
  sequelize.authenticate();
  console.log('Conectado com sucesso!');
} catch (error) {
  console.log(`Não foi possível conectar: ${error}`);
}

module.exports = sequelize;