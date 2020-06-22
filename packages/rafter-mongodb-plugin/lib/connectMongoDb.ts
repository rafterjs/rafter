import { MongoClient } from 'mongodb';

export default function connectMongoDb(mongoDb: MongoClient) {
  return async function connect(): Promise<void> {
    await mongoDb.connect();
  };
}
