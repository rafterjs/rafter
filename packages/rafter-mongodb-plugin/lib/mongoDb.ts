import { MongoClient } from 'mongodb';

export type IMongoDbConfig = {
  mongodb: {
    connectionString: string;
  };
};

export type IMongoDb = MongoClient;

export default function mongoDbFactory(config: IMongoDbConfig): IMongoDb {
  return new MongoClient(config.mongodb.connectionString, { useUnifiedTopology: true });
}
