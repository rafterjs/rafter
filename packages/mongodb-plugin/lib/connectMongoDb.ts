import { MongoClient } from 'mongodb';

export default function connectMongoDb(mongoDb: MongoClient) {
  return async function (): Promise<void> {
    await mongoDb.connect();
  };
}
