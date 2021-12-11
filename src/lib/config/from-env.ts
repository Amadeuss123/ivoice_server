// const definitions = require('./config-items');
import definitions from './config-items';
/**
 * Gets config values from environment
 */
export default function getEnvConfig(env: NodeJS.ProcessEnv) {
  const dockerServersEnv = Object.keys(env)
    .filter((key) => key.startsWith('DOCKER_SERVER__'))
    .reduce((envMap, envVar) => {
      envMap[envVar] = env[envVar];
      return envMap;
    }, {} as {[key: string]: any});
  return definitions
    .filter((definition) => definition.hasOwnProperty('envVar'))
    .reduce((envMap, definition) => {
      const { key, envVar } = definition;
      if (env[envVar]) {
        envMap[key] = env[envVar];
      }
      return envMap;
    }, dockerServersEnv);
};
