// const definitions = require('./config-items');
import definitions from './config-items';
/**
 * Gets default config values
 */
export default function getDefaultConfig() {
  return definitions.reduce(
    (configMap, definition) => ({
      ...configMap,
      [definition.key]: definition.defaultValue,
    }),
    {} as {[key: string]: any}
  );
};
