const Audio = require('./audio');
const Cache = require('./cache');
const Results = require('./results');
const Tasks = require('./tasks');
const Users = require('./users');

class Models {
  constructor(sequelizeDb, config, appLog) {
    this.sequelizeDb = sequelizeDb;
    this.users = new Users(sequelizeDb, config, appLog);
    this.tasks = new Tasks(sequelizeDb, config, appLog);
    this.audio = new Audio(sequelizeDb, config, appLog);
    this.results = new Results(sequelizeDb, config, appLog);
    this.cache = new Cache(sequelizeDb, config, appLog);
  }
}

module.exports = Models;
