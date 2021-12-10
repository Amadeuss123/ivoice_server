const path = require('path');
const Umzug = require('umzug');

function initMigrator(config, appLog, sequelize) {
  const umzug = new Umzug({
    storage: 'sequelize',
    storageOptions: {
      sequelize,
      tableName: 'schema_version',
    },
    logging: (message) => appLog.info(message),
    migrations: {
      params: [sequelize.queryInterface, config, appLog, sequelize],
      path: path.join(__dirname, '../../migrations'),
      pattern: /^\d+[\w-]+\.js$/,
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

module.exports = initMigrator;
