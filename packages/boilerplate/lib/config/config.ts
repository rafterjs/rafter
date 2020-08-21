export type BoilerplateConfig = {
  server: {
    port: number;
  };
  message: string;
  api: {
    version: string;
  };
  mongodb: {
    connectionString: string;
    databaseName: string;
  };
};

export default (): BoilerplateConfig => ({
  server: {
    port: 4000,
  },
  message: 'Hello my fellow developer. This text was set in config, then auto-loaded into a controller!',
  api: {
    version: '1.0.0',
  },
  mongodb: {
    connectionString: 'mongodb://root:example@localhost:27017',
    databaseName: 'rafter',
  },
});
