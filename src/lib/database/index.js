const SequelizeDb = require('../../sequelize');
const Models = require('../../models');

function initDatabase(config, appLog) {
  const sequelizeDb = new SequelizeDb(config);
  const models = new Models(sequelizeDb, config, appLog);
  return {
    sequelizeDb,
    models,
  };
}

module.exports = initDatabase;
