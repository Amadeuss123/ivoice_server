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

  public async createTaskResult(
    taskId: string,
    taskResult: {
      transcribeResult?: string,
      resultPath?: string,
      abstract?: string,
    }) {
    const { transcribeResult, resultPath, abstract } = taskResult;
    const result = await this.sequelizeDb.Result.create({
      taskId,
      content: transcribeResult ?? '',
      path: resultPath ?? '',
      abstract: abstract ?? '',
    })
    return result.toJSON();
  }

  public async getTaskResultByTaskId(taskId: string) {
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

  public async getTaskResultByResultId(resultId: string) {
    const result = await this.sequelizeDb.Result.findOne({
      where: {
        id: resultId,
      }
    });
    if (!result) {
      return null;
    }
    return result.toJSON();
  }

  public async updateTaskResultByTaskId(taskId: string, resultInfo: {
    content?: string,
    path?: string,
    abstract?: string,
  }) {
    const [result] = await this.sequelizeDb.Result.update({
      ...resultInfo,
    }, {
      where: {
        taskId
      }
    });
    if (result <= 0) {
      return false;
    }
    return true;
  }

  public async updateTaskResultByResultId(resultId: string, resultInfo: {
    content?: string,
    path?: string,
    abstract?: string,
  }) {
    const [result] = await this.sequelizeDb.Result.update({
      ...resultInfo,
    }, {
      where: {
        id: resultId,
      }
    });
    if (result <= 0) {
      return false;
    }
    return true;
  }
}

export default ResultManager;
