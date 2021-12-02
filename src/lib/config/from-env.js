const definitions = require('./config-items');

/**
 * Gets config values from environment
 * @param {object} env optional
 * @returns {object} configMap
 */
module.exports = function getEnvConfig(env) {
  const dokerServersEnv = Object.keys(env)
    .filter((key) => key.startsWith('DOCKER_SERVER__'))
    .reduce((envMap, envVar) => {
      envMap[envVar] = env[envVar];
      return envMap;
    }, {});
  return definitions
    .filter((definition) => definition.hasOwnProperty('envVar'))
    .reduce((envMap, definition) => {
      const { key, envVar } = definition;
      if (env[envVar]) {
        envMap[key] = env[envVar];
      }
      return envMap;
    }, dokerServersEnv);
};
