import { Model, ModelCtor, Sequelize } from 'sequelize';
import Config from '@lib/config';
import appLog from '@lib/log/app-log';
import initAudioModel from '@sequelize/audio';
import initCacheModel from '@sequelize/cache';
import initResultModel from '@sequelize/result';
import initTaskModel from '@sequelize/task';
import initUserModel from '@sequelize/user';
// import initUserTaskModel from '@sequelize/usertask';
import {
  AudioAttributes,
  AudioCreateAttributes,
  CacheAttributes,
  CacheCreateAttributes,
  ResultAttributes,
  ResultCreateAttributes,
  TaskAttributes,
  TaskCreateAttributes,
  UserAttributes,
  UserCreateAttributes,
  // UserTaskAttributes,
  // UserTaskCreateAttributes
} from '@sequelize/interface';

class SequelizeDb {
  public config: Config;
  public sequelize: Sequelize;
  public User: ModelCtor<Model<UserAttributes, UserCreateAttributes>>;
  public Cache: ModelCtor<Model<CacheAttributes, CacheCreateAttributes>>;
  public Result: ModelCtor<Model<ResultAttributes, ResultCreateAttributes>>;
  public Audio: ModelCtor<Model<AudioAttributes, AudioCreateAttributes>>;
  public Task: ModelCtor<Model<TaskAttributes, TaskCreateAttributes>>;
  // public UserTask: ModelCtor<Model<UserTaskAttributes, UserTaskCreateAttributes>>;

  public constructor(config: Config) {
    this.config = config;
    const backendDBURI = config.get('backendDBURI');
    const sequelize = new Sequelize(backendDBURI, {
      timezone: '+08:00',
      logging(message) {
        appLog.debug(message);
      },
    });

    this.sequelize = sequelize;
    this.User = initUserModel(sequelize);
    this.Audio = initAudioModel(sequelize);
    this.Task = initTaskModel(sequelize);
    this.Result = initResultModel(sequelize);
    this.Cache = initCacheModel(sequelize);
    // this.UserTask = initUserTaskModel(sequelize);
  }
}

export default SequelizeDb;
