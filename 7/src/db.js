const Sequelize = require('sequelize');

// setup database
// Option 1: Passing parameters separately
const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.USER,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    dialect: 'mysql',
    logging: false,
    define: {
      // The `timestamps` field specify whether or not the `createdAt` and `updatedAt` fields will be created.
      // This was true by default, but now is false by default
      timestamps: true
    }
  }
);

exports.sequelize = sequelize;

// test connections
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
