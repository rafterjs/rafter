export default {
  logger: {
    path: `${__dirname}/LoggingService`,
    dependencies: [`console`],
  },
  console: {
    path: `${__dirname}/console-logger-factory`,
    dependencies: [],
  },
};
