const pino = require('pino');

const levels = ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'];
const pinoDefaultConfig = {
  name: 'ivoice',
  timestamp: pino.stdTimeFunctions.isoTime,
};

class Logger {
  constructor(logLevel = 'warn') {
    if (!levels.includes(logLevel)) {
      throw new Error(`Unknown log level ${logLevel}`);
    }
    this.logLevel = logLevel;
    this.logger = pino({
      ...pinoDefaultConfig,
      level: logLevel,
    });
  }

  setLevel(logLevel) {
    if (!levels.includes(logLevel)) {
      throw new Error(`Unknown log level ${logLevel}`);
    }
    this.logger = pino({
      ...pinoDefaultConfig,
      level: logLevel,
    });
  }

  fatal(...args) {
    this.logger.fatal(...args);
  }

  error(...args) {
    this.logger.error(...args);
  }

  warn(...args) {
    this.logger.warn(...args);
  }

  info(...args) {
    this.logger.info(...args);
  }

  debug(...args) {
    this.logger.debug(...args);
  }

  trace(...args) {
    this.logger.trace(...args);
  }
}

module.exports = Logger;
