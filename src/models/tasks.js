class Tasks {
  constructor(sequelizeDb, config, appLog) {
    this.sequelizeDb = sequelizeDb;
    this.config = config;
    this.appLog = appLog;
  }
}

module.exports = Tasks;
