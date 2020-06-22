const Sequelize = require('sequelize');
const { sequelize } = require('../db');

const Session = sequelize.define(
  'Session',
  {
    sid: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    userId: Sequelize.STRING,
    expires: Sequelize.DATE,
    data: Sequelize.STRING(500)
  },
  {
    modelName: 'sessions'
  }
);

const init = async () => {
  await Session.sync({ force: true }); // force true will drop the table if it already exists
  console.log('Session Tables have synced!');
};

// init();

module.exports = Session;
