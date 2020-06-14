const Sequelize = require('sequelize');
const { sequelize } = require('../index');

const { Model } = Sequelize;

class User extends Model {}

User.init(
  {
    // attributes
    firstName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastName: {
      type: Sequelize.STRING
      // allowNull defaults to true
    },
    email: {
      type: Sequelize.STRING
      // allowNull defaults to true
    },
    password: {
      type: Sequelize.STRING
      // allowNull defaults to true
    }
  },
  {
    sequelize,
    modelName: 'User'
    // options
  }
);

module.exports = User;
