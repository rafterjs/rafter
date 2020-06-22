import { ILogger } from '@rafterjs/logger-plugin';

export default class MyService {
  private readonly logger: ILogger;

  constructor(logger: ILogger) {
    this.logger = logger;
  }

  public test(): void {
    this.logger.info('Hi ya');
  }
}
