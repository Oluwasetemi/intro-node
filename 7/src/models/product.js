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
    location: {
      type: Sequelize.STRING,
      // allowNull defaults to true
    },
    categories: {
      type: Sequelize.STRING,
      // allowNull defaults to true
    },
    quantity: {
      type: Sequelize.STRING,
      // allowNull defaults to true
    },
    price: {
      type: Sequelize.STRING,
    },
    discount: {
      type: Sequelize.STRING,
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
  }
);

const init = async () => {
  await Product.sync(); // force true will drop the table if it already exists
  console.log('Product Tables have synced!');
};

init();

module.exports = Product;
