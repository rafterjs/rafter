import { ILogger, LoggingArguments } from './ILogger';

/**
 * A generic logger class. This takes a logger, which could even be console if needed.
 */
export default class LoggingService implements ILogger {
  private loggingStrategy: ILogger;

  constructor(loggingStrategy: ILogger) {
    this.loggingStrategy = loggingStrategy;
  }

  /**
   * @param args
   */
  public log(...args: LoggingArguments): void {
    this.loggingStrategy.log(...args);
  }

  /**
   * @param args
   */
  public debug(...args: LoggingArguments): void {
    this.loggingStrategy.debug(...args);
  }

  /**
   * @param args
   */
  public info(...args: LoggingArguments): void {
    this.loggingStrategy.info(...args);
  }

  /**
   * @param args
   */
  public error(...args: LoggingArguments): void {
    this.loggingStrategy.error(...args);
  }

  /**
   * @param args
   */
  public warn(...args: LoggingArguments): void {
    this.loggingStrategy.warn(...args);
  }
}
