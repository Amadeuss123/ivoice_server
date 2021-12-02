const SequelizeDb = require("../../sequelize");
const Models = require("../../models");

function initDatabase(config) {
  const sequelizeDb = new SequelizeDb(config);
  const models = new Models(sequelizeDb, config);
  return {
    sequelizeDb,
    models
  }
}

module.exports = initDatabase;
