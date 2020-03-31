export type BoilerplateConfig = {
  server: {
    port: number;
  };
  message: string;
  api: {
    version: string;
  };
};

export default (): BoilerplateConfig => ({
  server: {
    port: 3000,
  },
  message: 'Hello my fellow developer. This text was set in config, then auto-loaded into a controller!',
  api: {
    version: '1.0.0',
  },
});
