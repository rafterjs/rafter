import { ILogger } from './ILogger';

export function consoleLoggerFactory(): ILogger {
  return console;
}
