import { IMongoDbConfig } from '../lib/mongoDb';

export default {
  mongodb: {
    connectionString: 'mongodb://admin:admin@localhost:27017',
    databaseName: 'rafter',
  },
} as IMongoDbConfig;
