const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../db');
const passportLocalSequelize = require('passport-local-sequelize')

// const { Model } = Sequelize;

// class User extends Model { }

// console.log(User.toString())

const User = passportLocalSequelize.defineUser(sequelize, {
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
    phone: {
      type: Sequelize.STRING
      // allowNull defaults to true
    },
    status: {
      type: Sequelize.ENUM,
      values: ['active', 'pending', 'deleted'],
      defaultValue: 'active'
    },
    type: {
      type: Sequelize.ENUM,
      values: ['admin', 'user', 'super'],
      defaultValue: 'user'
    }
}, {
    usernameField: 'email'
})

// User.init(
//   {
//     // attributes
//     firstName: {
//       type: Sequelize.STRING,
//       allowNull: false
//     },
//     lastName: {
//       type: Sequelize.STRING
//       // allowNull defaults to true
//     },
//     email: {
//       type: Sequelize.STRING
//       // allowNull defaults to true
//     },
//     phone: {
//       type: Sequelize.STRING
//       // allowNull defaults to true
//     },
//     password: {
//       type: Sequelize.STRING
//       // allowNull defaults to true
//     },
//     // salt: {
//     //   type: Sequelize.STRING
//     //   // allowNull defaults to true
//     // },
//     status: {
//       type: Sequelize.ENUM,
//       values: ['active', 'pending', 'deleted'],
//       defaultValue: 'active'
//     },
//     type: {
//       type: Sequelize.ENUM,
//       values: ['admin', 'user', 'super'],
//       defaultValue: 'user'
//     }
//   },
//   {
//     sequelize,
//     modelName: 'User',
//     // freezeTableName: true,
//     instanceMethods: {
//       generateHash(password) {
//         return bcrypt.hash(password, bcrypt.genSaltSync(8));
//       },
//       validPassword(password) {
//         return bcrypt.compare(password, this.password);
//       }
//     }
//   }
// );

const init = async () => {
  await User.sync(); //creates the table if it doesn't exist
//   await User.sync({ force: true }); // force true will drop the table if it already exists
  console.log('User Tables have synced!');
};

init();

module.exports = User;
