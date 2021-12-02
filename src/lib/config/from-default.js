const definitions = require('./config-items');

/**
 * Gets default config values
 * @returns {object} configMap
 */
module.exports = function getDefaultConfig() {
  return definitions.reduce(
    (configMap, definition) => ({
      ...configMap,
      [definition.key]: definition.defaultValue,
    }),
    {}
  );
};
