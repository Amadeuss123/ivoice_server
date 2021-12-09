require('module-alias');
const minimist = require('minimist');
const dotenv = require('dotenv');
const appLog = require('./src/lib/log/app_log');
const Config = require('./src/lib/config');
const initDatabase = require('./src/lib/database');
const initMigrator = require('./src/lib/migrator/init-migrator');
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');
const makeApp = require('./src/lib/app');

const argv = minimist(process.argv.slice(2));
console.log('argv: ', argv);

const isCliHas = (value) => {
  const loweredValue = argv._.map((argu) => argu.toLowerCase().trim());
  return loweredValue.includes(value);
};

const configFilePath = argv.config || process.env.CONFIG;
if (configFilePath?.includes('.env')) {
  const result = dotenv.config({ path: configFilePath });
  console.log('dotenv result: ', result);
  if (result.error) {
    appLog.error(result.error, 'Error loading .env file');
    process.exit(1);
  }
}

const config = new Config(argv, process.env);

const migrateOnly = config.get('migrate') || isCliHas('migrate');

appLog.setLevel(config.get('appLogLevel'));
appLog.debug(config.get(), 'Final config');
appLog.debug(config.getDockerServers(), 'Docker Servers from config');

const baseUrl = config.get('baseUrl');
const ip = config.get('ip');
const port = config.get('port');
const certPassphrase = config.get('certPassphrase');
const keyPath = config.get('keyPath');
const certPath = config.get('certPath');

const { sequelizeDb, models } = initDatabase(config);

let server;

const initServer = async () => {
  const migrator = initMigrator(config, appLog, sequelizeDb.sequelize);
  const isSchemaUpToDate = await migrator.isSchemaUpToDate();

  const isRunMigrations = migrateOnly || config.get('dbAutomigrate');

  if (!isSchemaUpToDate && !isRunMigrations) {
    appLog.error(
      'Schema not up to date. Turn on automigration or use --migrate'
    );
    process.exit(1);
  }

  if (isRunMigrations) {
    appLog.info('Running migrations');
    await migrator.migrate();
    appLog.info('Migrations finished');
  }

  const indexPath = path.join(__dirname, 'public/index.html');
  const indexTemplatePath = path.join(__dirname, 'public/index-implate.html');
  if (fs.existsSync(indexPath)) {
    fs.renameSync(indexPath, indexTemplatePath);
  }

  const audioFolderPath = path.join(
    __dirname,
    `/${config.get('audioFilesDirName')}/`
  );
  if (!fs.existsSync(audioFolderPath)) {
    fs.mkdir(audioFolderPath, (err) => {
      if (err) {
        appLog.error(err);
        process.exit(1);
      }
    });
  }

  const app = await makeApp(config, models);

  if (keyPath && certPath) {
    const privateKey = fs.readFileSync(keyPath, 'utf8');
    const certificate = fs.readFileSync(certPath, 'utf8');
    const httpsOptions = {
      key: privateKey,
      cert: certificate,
      passphrase: certPassphrase,
    };

    server = https.createServer(httpsOptions, app).listen(port, ip, () => {
      const hostIP = ip === '0.0.0.0' ? 'localhost' : ip;
      const url = `https://${hostIP}:${port}${baseUrl}`;
      appLog.info(`This is IVoice! Visit ${url} to get started`);
    });
  } else {
    server = http.createServer(app).listen(port, ip, () => {
      const hostIP = ip === '0.0.0.0' ? 'localhost' : ip;
      const url = `http://${hostIP}:${port}${baseUrl}`;
      appLog.info(`This is IVoice! Visit ${url} to get started`);
    });
  }
};

initServer().catch((error) => {
  appLog.error(error, 'Error starting');
  process.exit(1);
});

const handleShutdownSignal = (signal) => {
  if (!server) {
    appLog.info('Received %s, but no server to shutdown', signal);
    process.exit(0);
  } else {
    appLog.info('Received %s, shutting down server...', signal);
    server.close(function () {
      process.exit(0);
    });
  }
};

process.on('SIGTERM', handleShutdownSignal);
process.on('SIGINT', handleShutdownSignal);
