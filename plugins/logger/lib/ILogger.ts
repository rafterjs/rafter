export type LoggingArguments = unknown[];

export interface ILogger {
  log(level: string, ...args: LoggingArguments): void;

  debug(...args: LoggingArguments): void;

  info(...args: LoggingArguments): void;

  error(...args: LoggingArguments): void;

  warn(...args: LoggingArguments): void;
}
