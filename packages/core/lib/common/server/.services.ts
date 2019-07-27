export default {
  server: {
    path: `${__dirname}/Server`,
    dependencies: [
      'express',
      'routesProvider',
      'middlewareProvider',
      'preStartHooksProvider',
      'middleware',
      'routes',
      'preStartHooks',
      'config.server.port',
      'logger',
    ],
  },
};
