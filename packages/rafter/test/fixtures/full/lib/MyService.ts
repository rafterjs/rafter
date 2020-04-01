import { ILogger } from '@rafterjs/utils';

export default class MyService {
  private readonly logger: ILogger;

  constructor(logger: ILogger) {
    this.logger = logger;
  }

  public test(): void {
    this.logger.info('Hi ya');
  }
}
