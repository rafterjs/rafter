import { ILogger } from '../../lib/utils/logger/ILogger';

export default class MyService {
  private readonly logger: ILogger;

  constructor(logger: ILogger) {
    this.logger = logger;
  }

  public log(message: string): void {
    this.logger.log(message);
  }
}
