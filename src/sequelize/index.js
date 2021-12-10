const { Sequelize } = require('sequelize');
const appLog = require('../lib/log/app_log');

class SequelizeDb {
  constructor(config) {
    this.config = config;

    const backendDBURI = config.get('backendDBURI');
    const sequelize = new Sequelize(backendDBURI, {
      timezone: '+08:00',
      logging(message) {
        appLog.debug(message);
      },
    });

    this.sequelize = sequelize;
    this.Sequelize = Sequelize;
    this.Users = require('./users')(sequelize);
    this.Audio = require('./audio')(sequelize);
    this.Tasks = require('./tasks')(sequelize);
    this.Results = require('./results')(sequelize);
    this.Cache = require('./cache')(sequelize);
  }
}

module.exports = SequelizeDb;
