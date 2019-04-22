/**
 * A generic logger class. This takes a logger, which could even be console if needed.
 * @param {object} loggingService
 * @return {Logger}
 */
export default loggingService => {
  /**
   * @namespace Logger
   */
  const Logger = {};

  /**
   * @param args
   */
  Logger.log = (...args) => {
    if (loggingService.log instanceof Function) {
      loggingService.log(...args);
    }
  };

  /**
   * @param args
   */
  Logger.debug = (...args) => {
    if (loggingService.debug instanceof Function) {
      loggingService.debug(...args);
    }
  };

  /**
   * @param args
   */
  Logger.info = (...args) => {
    if (loggingService.info instanceof Function) {
      loggingService.info(...args);
    }
  };

  /**
   * @param args
   */
  Logger.error = (...args) => {
    if (loggingService.error instanceof Function) {
      loggingService.error(...args);
    }
  };

  /**
   * @param args
   */
  Logger.warn = (...args) => {
    if (loggingService.warn instanceof Function) {
      loggingService.warn(...args);
    }
  };

  return Object.freeze(Logger);
};
