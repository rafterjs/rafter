export default {
  middlewareProvider: {
    path: `${__dirname}/MiddlewareProvider`,
    dependencies: [`diContainer`, `logger`],
  },
};
