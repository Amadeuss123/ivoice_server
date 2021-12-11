// const definitions = require('./config-items');
import definitions from './config-items';
import { ParsedArgs } from 'minimist';
/**
 * Gets config values from argv param
 * 
 */
export default function getCliConfig(argv: ParsedArgs) {
  return definitions.reduce((confMap, definition) => {
    const { key } = definition;

    if (argv[key] != null) {
      confMap[key] = argv[key];
    }

    return confMap;
  }, {} as {[key: string]: any});
};
