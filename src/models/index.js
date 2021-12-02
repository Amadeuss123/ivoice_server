const Audio = require("./audio");
const Results = require("./results");
const Tasks = require("./tasks");
const Users = require("./users");

class Models {
  constructor(sequelizeDb, config) {
    this.sequelizeDb = sequelizeDb;
    this.users = new Users(sequelizeDb, config);
    this.tasks = new Tasks(sequelizeDb, config);
    this.audio = new Audio(sequelizeDb, config);
    this.results = new Results(sequelizeDb, config);
  }
}

module.exports = Models;
