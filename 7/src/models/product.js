const Sequelize = require('sequelize');
const { sequelize } = require('../db');

const { Model } = Sequelize;

class Product extends Model {}

Product.init(
  {
    // attributes
    productId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    productName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    quantity: {
      type: Sequelize.STRING,
      // allowNull defaults to true
    },
    barcode: {
      type: Sequelize.STRING,
      // allowNull defaults to true
    },
    userId: {
      type: Sequelize.STRING,
      // allowNull defaults to true
    },
    description: {
      type: Sequelize.STRING,
      // allowNull defaults to true
    },
    image: {
      type: Sequelize.STRING,
      // allowNull defaults to true
    },
  },
  {
    sequelize,
    modelName: 'Product',
    // optionsb 
  }
);

const init = async () => {
  await Product.sync(); // force true will drop the table if it already exists
  console.log('Product Tables have synced!');
};

init();

module.exports = Product;
