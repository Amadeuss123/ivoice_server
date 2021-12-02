const fromDefault = require('./from-default');
const fromEnv = require('./from-env');
const fromCli = require('./from-cli');
const fromFile = require('./from-file');

class Config {
  constructor(argv, env) {
    this.argv = argv;
    this.env = env;

    const configFilePath = argv.config || env.CONFIG;

    const defaultConfig = fromDefault();
    const envConfig = fromEnv(env);
    const fileConfig = fromFile(configFilePath);
    const cliConfig = fromCli(argv);

    const all = { ...defaultConfig, ...envConfig, ...fileConfig, ...cliConfig };

    // Clean string boolean values
    Object.keys(all).forEach((key) => {
      const value = all[key];
      if (typeof value === 'string') {
        if (value.trim().toLowerCase() === 'true') {
          all[key] = true;
        } else if (value.trim().toLowerCase() === 'false') {
          all[key] = false;
        }
      }
    });

    this.configFilePath = configFilePath;
    this.envConfig = envConfig;
    this.fileConfig = fileConfig;
    this.cliConfig = cliConfig;
    this.all = all;
  }

  get(key) {
    if (!key) {
      return this.all;
    }

    if (!this.all.hasOwnProperty(key)) {
      throw new Error(`config item ${key} not defined in configItems.js`);
    }

    return this.all[key];
  }

  smtpConfigured() {
    return (
      this.all.smtpHost &&
      this.all.smtpUser &&
      this.all.smtpFrom &&
      this.all.smtpPort &&
      this.all.publicUrl
    );
  }

  /**
   * 获取数据库服务器配置
   * @returns {DockerServer[]}
   */
  getDockerServers() {
    const dockerServerMap = Object.keys(this.all)
      .filter((key) => key.startsWith('DOCKER_SERVER__'))
      .reduce((dockerServerMap, config) => {
        // eslint-disable-next-line no-unused-vars
        const [prefix, id, field] = config.split('__');
        if (!dockerServerMap[id]) dockerServerMap[id] = {};
        dockerServerMap[id][field] = this.all[config];
        return dockerServerMap;
      }, {});
    const dockerServers = [];
    for (const id in dockerServerMap) {
      if (Object.prototype.hasOwnProperty.call(dockerServerMap, id)) {
        const dockerServer = dockerServerMap[id];
        dockerServers.push({
          ...dockerServer,
          id,
          port: dockerServer.port ?? 2376,
          protocol: dockerServer.protocol ?? 'https',
          container: dockerServer.container ?? 1,
        });
      }
    }
    return dockerServers.sort((a, b) => a.id.localeCompare(b.id));
  }
}

module.exports = Config;
