import Config from '../lib/config';
import AppLogger from '../lib/log/logger';
import SequelizeDb from '../sequelize';
import AudioManager from './audio';
import CacheManager from './cache';
import ResultsManager from './results';
import TasksManager from './tasks';
import UsersManager from './users';

class ModelsManager {
  public sequelizeDb: SequelizeDb;
  public usersManager: UsersManager;
  public tasksManager: TasksManager;
  public audioManager: AudioManager;
  public resultsManager: ResultsManager;
  public cacheManager: CacheManager;

  public constructor(sequelizeDb: SequelizeDb, config: Config, appLog: AppLogger) {
    this.sequelizeDb = sequelizeDb;
    this.usersManager = new UsersManager(sequelizeDb, config, appLog);
    this.tasksManager = new TasksManager(sequelizeDb, config, appLog);
    this.audioManager = new AudioManager(sequelizeDb, config, appLog);
    this.resultsManager = new ResultsManager(sequelizeDb, config, appLog);
    this.cacheManager = new CacheManager(sequelizeDb, config, appLog);
  }
}

export default ModelsManager;
