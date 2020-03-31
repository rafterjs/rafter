import { ILogger, LoggingArguments, LogLevel } from './ILogger';

/**
 * A generic logger class. This takes a logger, which could even be console if needed.
 */
export class LoggingService implements ILogger {
  private loggingStrategy: ILogger;

  constructor(loggingStrategy: ILogger) {
    this.loggingStrategy = loggingStrategy;
  }

  public log(level: LogLevel, ...args: LoggingArguments): void {
    this.loggingStrategy.log(level, ...args);
  }

  public debug(...args: LoggingArguments): void {
    this.loggingStrategy.debug(...args);
  }

  public info(...args: LoggingArguments): void {
    this.loggingStrategy.info(...args);
  }

  public error(...args: LoggingArguments): void {
    this.loggingStrategy.error(...args);
  }

  public warn(...args: LoggingArguments): void {
    this.loggingStrategy.warn(...args);
  }
}
