import { IDatabase } from './Database';

export default async function connectToDatabase(database: IDatabase) {
  return async (): Promise<void> => {
    await database.test();
  };
}
