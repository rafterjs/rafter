export type LoggingArguments = (string | number | Function | object | boolean)[];

/**
 * A generic logger class. This takes a logger, which could even be console if needed.
 */
export interface ILogger {
  log(...args: LoggingArguments): void;

  debug(...args: LoggingArguments): void;

  info(...args: LoggingArguments): void;

  error(...args: LoggingArguments): void;

  warn(...args: LoggingArguments): void;
}
