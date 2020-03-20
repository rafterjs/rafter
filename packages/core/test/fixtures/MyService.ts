import { ILogger } from '@rafter/utils';

export default class MyService {
  private readonly logger: ILogger;

  constructor(logger: ILogger) {
    this.logger = logger;
  }

  public log(message: string): void {
    this.logger.log(message);
  }
}
