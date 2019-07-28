import { ILogger, LoggingArguments } from './ILogger';

/**
 * A generic logger class. This takes a logger, which could even be console if needed.
 * @param {object} loggingService
 * @return {Logger}
 */
export default class LoggingService implements ILogger {
  private loggingService: ILogger;

  constructor(loggingService: ILogger) {
    this.loggingService = loggingService;
  }

  /**
   * @param args
   */
  public log(...args: LoggingArguments): void {
    this.loggingService.log(...args);
  }

  /**
   * @param args
   */
  public debug(...args: LoggingArguments): void {
    this.loggingService.debug(...args);
  }

  /**
   * @param args
   */
  public info(...args: LoggingArguments): void {
    this.loggingService.info(...args);
  }

  /**
   * @param args
   */
  public error(...args: LoggingArguments): void {
    this.loggingService.error(...args);
  }

  /**
   * @param args
   */
  public warn(...args: LoggingArguments): void {
    this.loggingService.warn(...args);
  }
}
