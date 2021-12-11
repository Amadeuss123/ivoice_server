import pino, { Logger } from 'pino';

const levels = ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'];
const pinoDefaultConfig = {
  name: 'ivoice',
  timestamp: pino.stdTimeFunctions.isoTime,
};

class AppLogger {
  private logLevel: string;
  private logger: Logger;
  public constructor(logLevel = 'warn') {
    if (!levels.includes(logLevel)) {
      throw new Error(`Unknown log level ${logLevel}`);
    }
    this.logLevel = logLevel;
    this.logger = pino({
      ...pinoDefaultConfig,
      level: logLevel,
    });
  }

  public setLevel(logLevel: string) {
    if (!levels.includes(logLevel)) {
      throw new Error(`Unknown log level ${logLevel}`);
    }
    this.logLevel = logLevel;
    this.logger = pino({
      ...pinoDefaultConfig,
      level: this.logLevel,
    });
  }

  public fatal(obj: any, message?: string | undefined, ...rest: any[]) {
    this.logger.fatal(obj, message, ...rest);
  }

  public error(obj: any, message?: string | undefined, ...rest: any[]) {
    this.logger.error(obj, message, ...rest);
  }

  public warn(obj: any, message?: string | undefined, ...rest: any[]) {
    this.logger.warn(obj, message, ...rest);
  }

  public info(obj: any, message?: string | undefined, ...rest: any[]) {
    this.logger.info(obj, message, ...rest);
  }

  public debug(obj: any, message?: string | undefined, ...rest: any[]) {
    this.logger.debug(obj, message, ...rest);
  }

  public trace(obj: any, message?: string | undefined, ...rest: any[]) {
    this.logger.trace(obj, message, ...rest);
  }
}

export default AppLogger;