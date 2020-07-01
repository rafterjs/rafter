import { IMongoDb } from '@rafterjs/mongodb-plugin';
import { ILogger } from '@rafterjs/logger-plugin';

export interface IDatabase {
  connect(connectionStr: string): void;
}

export default class Database implements IDatabase {
  private mongoDb: IMongoDb;

  private logger: ILogger;

  constructor(mongoDb: IMongoDb, logger: ILogger) {
    this.mongoDb = mongoDb;
    this.logger = logger;
  }

  public async connect(connectionStr: string): Promise<void> {
    this.logger.info(`Connecting to database: `, connectionStr);
  }
}
