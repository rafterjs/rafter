import { MongoClient } from 'mongodb';

export type IMongoDbConfig = {
  mongodb: {
    connectionString: string;
    databaseName: string;
  };
};

export default function mongoDbFactory(config: IMongoDbConfig): MongoClient {
  return new MongoClient(config.mongodb.connectionString);
}
