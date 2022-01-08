import P from "pino";
import Config from "../lib/config";
import AppLogger from "../lib/log/logger";
import SequelizeDb from "../sequelize";

class ResultManager {
  private sequelizeDb: SequelizeDb;
  private config: Config;
  private appLog: AppLogger;
  constructor(sequelizeDb: SequelizeDb, config: Config, appLog: AppLogger) {
    this.sequelizeDb = sequelizeDb;
    this.config = config;
    this.appLog = appLog;
  }

  public async createTaskResult(taskId: string, taskResult?: string, resultPath?: string) {
    const result = await this.sequelizeDb.Result.create({
      taskId,
      content: taskResult ?? '',
      path: resultPath ?? ''
    })
    return result.toJSON();
  }

  public async getTaskResult(taskId: string) {
    const result = await this.sequelizeDb.Result.findOne({
      where: {
        taskId,
      }
    });
    if (!result) {
      return null;
    }
    return result.toJSON();
  }
}

export default ResultManager;
