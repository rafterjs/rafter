export default {
  logger: {
    path: `${__dirname}/LoggingService`,
    dependencies: ['console'],
  },
  console: {
    path: `${__dirname}/ConsoleLoggerFactory`,
    dependencies: [],
  },
};
