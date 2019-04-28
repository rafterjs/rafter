import { ILogger } from './ILogger';

/**
 * A generic logger class. This takes a logger, which could even be console if needed.
 * @param {object} loggingService
 * @return {Logger}
 */
export default class LoggingService implements ILogger {
  loggingService: ILogger;

  constructor(loggingService: ILogger) {
    this.loggingService = loggingService;
  }

  /**
   * @param args
   */
  log(...args) {
    this.loggingService.log(...args);
  }

  /**
   * @param args
   */
  debug(...args) {
    this.loggingService.debug(...args);
  }

  /**
   * @param args
   */
  info(...args) {
    this.loggingService.info(...args);
  }

  /**
   * @param args
   */
  error(...args) {
    this.loggingService.error(...args);
  }

  /**
   * @param args
   */
  warn(...args) {
    this.loggingService.warn(...args);
  }
}
