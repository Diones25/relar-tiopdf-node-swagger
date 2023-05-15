const { DataTypes } = require('sequelize');
const db = require('../db/conn.js');

const Product = db.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
},
{
  timestamps: true
}
);

module.exports = Product;