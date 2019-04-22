/**
 *
 * @param {Box} diContainer
 * @param {Logger} logger
 * @return {MiddlewareProvider}
 */
export default (diContainer, logger) => {
  /**
   * @namespace MiddlewareProvider
   */
  const MiddlewareProvider = {};

  /**
   * @param {string[]} middlewareConfig
   * @return {Function[]|Array[]}
   */
  MiddlewareProvider.createInstance = middlewareConfig => {
    const middlewareCollection = [];

    Object.values(middlewareConfig).forEach(async middlewareServiceName => {
      try {
        this._logger.info(`    Adding middleware: ${middlewareServiceName}`);
        const middleware = diContainer.get(middlewareServiceName);
        middlewareCollection.push(middleware);
      } catch (error) {
        logger.error(`    Could not add middleware: ${middlewareServiceName}`, error);
      }
    });

    return middlewareCollection;
  };

  return Object.freeze(MiddlewareProvider);
};
