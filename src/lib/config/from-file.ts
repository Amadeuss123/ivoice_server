import fs from 'fs';
import path from 'path';
import ini from 'ini';
import appLog from '../log/app-log';

/**
 * Reads and parses config file.
 * This file may be either JSON or INI file.
 * @param {string} configFilePath
 */
function fromFile(configFilePath: string) {
  let parsedFile = {};

  if (!configFilePath) {
    return {};
  }

  if (typeof configFilePath !== 'string') {
    throw new Error('Config file must be string');
  }

  if (!fs.existsSync(configFilePath)) {
    throw new Error(`Config file ${configFilePath} not found`);
  }

  const fileText = fs.readFileSync(configFilePath, { encoding: 'utf8' });
  const extname = path.extname(configFilePath).toLowerCase();

  try {
    if (configFilePath.includes('.env')) {
      // Return an empty object.
      // .env is applied to process.env and therefore processed with environment variables
      return {};
    } else if (extname === '.json') {
      parsedFile = JSON.parse(fileText);
    } else if (extname === '.ini') {
      parsedFile = ini.parse(fileText);
    } else {
      appLog.warn(`Unknown file extension for ${configFilePath}`);
      appLog.warn(`File will be parsed as JSON.`);
      parsedFile = JSON.parse(fileText);
    }
  } catch (error) {
    appLog.error(error, `Error parsing file ${configFilePath}`);
    throw new Error(`Error parsing config file ${configFilePath}`);
  }

  return parsedFile;
}

export default fromFile;
