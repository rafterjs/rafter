import { ILogger } from './ILogger';

export class ConsoleLoggerFactory {
  public createInstance(): ILogger {
    return console;
  }
}
