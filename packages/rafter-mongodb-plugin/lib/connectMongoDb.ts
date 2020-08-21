import { MongoClient } from 'mongodb';
import { ILogger } from '@rafterjs/logger-plugin';
import { IMongoDbConfig } from './mongoDb';

export default function connectMongoDb(mongoDb: MongoClient, config: IMongoDbConfig, logger: ILogger) {
  return async function connect(): Promise<void> {
    logger.info(`Connecting to database via: ${config.mongodb.connectionString}.`);
    await mongoDb.connect();
    logger.info(`Connected to database.`);
  };
}
