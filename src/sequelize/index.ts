import { Model, ModelCtor, Sequelize } from 'sequelize';
import Config from '../lib/config';
import appLog from '../lib/log/app-log';
import initAudioModel from './audio';
import initCacheModel from './cache';
import initResultsModel from './results';
import initTasksModel from './tasks';
import initUsersModel from './users';
import {
  AudioAttributes,
  AudioCreateAttributes,
  CacheAttributes,
  CacheCreateAttributes,
  ResultsAttributes,
  ResultsCreateAttributes,
  TasksAttributes,
  TasksCreateAttributes,
  UsersAttributes,
  UsersCreateAttributes
} from './interface';

class SequelizeDb {
  public config: Config;
  public sequelize: Sequelize;
  public Users: ModelCtor<Model<UsersAttributes, UsersCreateAttributes>>;
  public Cache: ModelCtor<Model<CacheAttributes, CacheCreateAttributes>>;
  public Results: ModelCtor<Model<ResultsAttributes, ResultsCreateAttributes>>;
  public Audio: ModelCtor<Model<AudioAttributes, AudioCreateAttributes>>;
  public Tasks: ModelCtor<Model<TasksAttributes, TasksCreateAttributes>>;
  
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
    this.Users = initUsersModel(sequelize);
    this.Audio = initAudioModel(sequelize);
    this.Tasks = initTasksModel(sequelize);
    this.Results = initResultsModel(sequelize);
    this.Cache = initCacheModel(sequelize);
  }
}

export default SequelizeDb;
