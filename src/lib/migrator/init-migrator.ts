import Config from '@lib/config';
import AppLogger from '@lib/log/logger';
import SequelizeDb from '@sequelize';
import path from 'path';
import { Sequelize } from 'sequelize';
import Umzug from 'umzug';

function initMigrator(config: Config, appLog: AppLogger, sequelize: Sequelize) {
  const umzug = new Umzug({
    storage: 'sequelize',
    storageOptions: {
      sequelize,
      tableName: 'schema_version',
    },
    logging: (message: string) => appLog.info(message),
    migrations: {
      params: [sequelize.getQueryInterface(), config, appLog, sequelize],
      path: path.join(__dirname, '../../migrations'),
      pattern: /^\d+[\w-]+\.ts$/,
    },
  });

  return {
    migrate() {
      return umzug.up();
    },
    async isSchemaUpToDate() {
      const pending = await umzug.pending();
      return pending.length === 0;
    },
  };
}

export default initMigrator;
