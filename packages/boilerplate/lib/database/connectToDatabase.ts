import { IDatabase } from './Database';
import { BoilerplateConfig } from '../config/config';

export default function connectToDatabase(database: IDatabase, config: BoilerplateConfig) {
  return async (): Promise<void> => {
    const { db } = config;
    await database.connect(db.connectionStr);
  };
}
