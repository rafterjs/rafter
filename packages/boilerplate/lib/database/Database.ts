import { IMongoDb } from '@rafterjs/mongodb-plugin';
import { ILogger } from '@rafterjs/logger-plugin';

export interface IDatabase {
  test(): void;
}

export default class Database implements IDatabase {
  private mongoDb: IMongoDb;

  private logger: ILogger;

  constructor(mongoDb: IMongoDb, logger: ILogger) {
    this.mongoDb = mongoDb;
    this.logger = logger;
  }

  public async test(): Promise<void> {
    this.logger.info(`--------------------- IN DB`);
  }
}
