import Config from "../lib/config";
import AppLogger from "../lib/log/logger";
import SequelizeDb from "../sequelize";

class TasksManager {
  private sequelizeDb: SequelizeDb;
  private config: Config;
  private appLog: AppLogger;
  constructor(sequelizeDb: SequelizeDb, config: Config, appLog: AppLogger) {
    this.sequelizeDb = sequelizeDb;
    this.config = config;
    this.appLog = appLog;
  }
}

export default TasksManager;
