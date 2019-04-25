export default {
  server: {
    path: `${__dirname}/server`,
    dependencies: [
      `express`,
      `routesProvider`,
      `middlewareProvider`,
      `preStartHooksProvider`,
      `middleware`,
      `routes`,
      `preStartHooks`,
      `config.server.port`,
      `logger`,
    ],
  },
};
