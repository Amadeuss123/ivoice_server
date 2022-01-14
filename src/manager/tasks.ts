import { TaskStatus, TaskType } from "@const/task";
import P from "pino";
import Config from "../lib/config";
import AppLogger from "../lib/log/logger";
import SequelizeDb from "../sequelize";

class TaskManager {
  private sequelizeDb: SequelizeDb;
  private config: Config;
  private appLog: AppLogger;
  constructor(sequelizeDb: SequelizeDb, config: Config, appLog: AppLogger) {
    this.sequelizeDb = sequelizeDb;
    this.config = config;
    this.appLog = appLog;
  }

  public async createTasks(taskType: string, fileIds: string[], userId: string) {
    try {
      const tasks = await this.sequelizeDb.Task.bulkCreate(fileIds.map((fileId) => {
        return {
          taskType: taskType === 'recognize' ? TaskType.Recognize : TaskType.Denoise,
          audioId: fileId,
          userId,
          taskStatus: TaskStatus.Waiting,
        }
      }));
      // await this.sequelizeDb.UserTask.bulkCreate(tasks.map((task) => {
      //   const taskObj = task.toJSON();
      //   return {
      //     userId,
      //     taskId: taskObj.id,
      //     taskStatus: TaskStatus.Waiting,
      //   }
      // }))
      return {
        success: true,
        info: tasks.map((task) => ({
          taskId: task.toJSON().id,
          audioId: task.toJSON().audioId,
        })),
      }
    }catch(e) {
      this.appLog.error(e);
      return {
        success: false,
      };
    }
  }

  public async findTasksByUserId(userId: string) {
    const userTasks = await this.sequelizeDb.Task.findAll({
      where: {
        userId
      }
    });
    
    return await Promise.all(userTasks.map(async (task) => {
      const audioId = task.getDataValue('audioId');
      const audioInfo = await this.sequelizeDb.Audio.findOne({
        where: {
          id: audioId,
        }
      });
      if (!audioInfo) {
        return null;
      }
      return {
        ...task.toJSON(),
        audio: {
          name: audioInfo.toJSON().name,
          duration: audioInfo.toJSON().audioTime
        }
      }
    }));
  }

  public async findTaskByTaskId(taskId: string) {
    const task = await this.sequelizeDb.Task.findOne({
      where: {
        id: taskId,
      },
    });
    if (!task) {
      return null;
    }
    return task.toJSON();
  }

  public async updateTaskStatus(taskId: string, taskStatus: TaskStatus) {
    const [count] = await this.sequelizeDb.Task.update({
      taskStatus,
    }, {
      where: {
        id: taskId
      }
    });
    if (count > 0) {
      return true;
    }
    return false;
  }
}

export default TaskManager;
