const Sequelize = require('sequelize');
const { sequelize } = require('../db');

const Session = sequelize.define(
  'Session',
  {
    sid: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    userId: Sequelize.STRING,
    expires: Sequelize.DATE,
    data: Sequelize.STRING(500),
  },
  {
    modelName: 'Session',
  }
);

const init = async () => {
  await Session.sync();
  console.log('Session Tables have synced!');
};

// init();

module.exports = Session;
