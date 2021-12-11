import Config from "@lib/config";
import AppLogger from "@lib/log/logger";
import SequelizeDb from '@sequelize/index';
import ModelsManager from '@manager/index';

function initDatabase(config: Config, appLog: AppLogger) {
  const sequelizeDb = new SequelizeDb(config);
  const models = new ModelsManager(sequelizeDb, config, appLog);
  return {
    sequelizeDb,
    models,
  };
}

export default initDatabase;
