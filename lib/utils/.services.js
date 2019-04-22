export default {
  logger: {
    path: `${__dirname}/logger`,
    dependencies: [`console`],
  },
  console: {
    path: `${__dirname}/console-logger-factory`,
    dependencies: [],
  },
};
