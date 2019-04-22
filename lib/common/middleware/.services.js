export default {
  middlewareProvider: {
    path: `${__dirname}/middleware-provider`,
    dependencies: [`diContainer`, `logger`],
  },
};
