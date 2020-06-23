import { createLogger, format as winstonFormat, transports as winstonTransports } from 'winston';
import TransportStream from 'winston-transport';
import { Format } from 'logform';

export type LoggingArguments = (string | number | Function | object | boolean)[];

export enum LogLevel {
  DEBUG = 'debug',
  WARN = 'warn',
  INFO = 'info',
  ERROR = 'error',
}

export interface ILogger {
  log(level: LogLevel, ...args: LoggingArguments): void;

  debug(...args: LoggingArguments): void;

  info(...args: LoggingArguments): void;

  error(...args: LoggingArguments): void;

  warn(...args: LoggingArguments): void;
}

export class MockLogger implements ILogger {
  public log(level: LogLevel, ...args: LoggingArguments): void {
    // empty on purpose
  }

  public debug(...args: LoggingArguments): void {
    // empty on purpose
  }

  public info(...args: LoggingArguments): void {
    // empty on purpose
  }

  public error(...args: LoggingArguments): void {
    // empty on purpose
  }

  public warn(...args: LoggingArguments): void {
    // empty on purpose
  }
}

export type LogLevelOptions = keyof typeof LogLevel;

export type ILoggerConfig = {
  logger?: {
    level?: LogLevel;
    format?: Format;
    transports?: TransportStream | TransportStream[];
  };
};

export default function loggerFactory(config?: ILoggerConfig): ILogger {
  const { level = LogLevel.DEBUG, format = winstonFormat.simple(), transports = [new winstonTransports.Console()] } =
    config?.logger || {};

  return createLogger({
    level,
    format,
    transports,
  });
}
