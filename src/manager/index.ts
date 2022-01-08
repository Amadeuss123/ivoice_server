import Config from '../lib/config';
import AppLogger from '../lib/log/logger';
import SequelizeDb from '../sequelize';
import AudioManager from './audio';
import CacheManager from './cache';
import ResultManager from './results';
import TaskManager from './tasks';
import UserManager from './users';

class ModelsManager {
  public sequelizeDb: SequelizeDb;
  public userManager: UserManager;
  public taskManager: TaskManager;
  public audioManager: AudioManager;
  public resultManager: ResultManager;
  public cacheManager: CacheManager;

  public constructor(sequelizeDb: SequelizeDb, config: Config, appLog: AppLogger) {
    this.sequelizeDb = sequelizeDb;
    this.userManager = new UserManager(sequelizeDb, config, appLog);
    this.taskManager = new TaskManager(sequelizeDb, config, appLog);
    this.audioManager = new AudioManager(sequelizeDb, config, appLog);
    this.resultManager = new ResultManager(sequelizeDb, config, appLog);
    this.cacheManager = new CacheManager(sequelizeDb, config, appLog);
  }
}

export default ModelsManager;
