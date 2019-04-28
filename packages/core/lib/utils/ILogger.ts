/**
 * A generic logger class. This takes a logger, which could even be console if needed.
 */
export interface ILogger {
  log(...args: any): void;

  debug(...args: any): void;

  info(...args: any): void;

  error(...args: any): void;

  warn(...args: any): void;
}
