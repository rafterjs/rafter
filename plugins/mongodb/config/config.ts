import { IMongoDbConfig } from '../lib/mongoDb';

export default {
  mongodb: {
    // connectionString: 'mongodb://localhost:27017/rafter',
    connectionString: 'mongodb://root:example@localhost:27017',
    databaseName: 'rafter',
  },
} as IMongoDbConfig;
