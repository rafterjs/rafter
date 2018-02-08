export default class ConfigMiddlewareProvider {
    /**
     * @param {Box} diContainer
     * @param {Logger} logger
     */
    constructor(
        diContainer,
        logger,
    ) {
        this._diContainer = diContainer;
        this._logger = logger;
    }

    /**
     * @param {object} middlewareConfig
     * @return {Function[]|Array[]}
     */
    createInstance(middlewareConfig) {
        const middlewareCollection = [];
        for (const middleware of middlewareConfig) {
            try {
                this._logger.info(`    Adding middleware: ${middleware}`);
                const middlewareFunction = this._diContainer.get(middleware);
                middlewareCollection.push(middlewareFunction);
            } catch (error) {
                this._logger.error(`    Could not add middleware: ${middleware}`, error);
            }
        }

        return middlewareCollection;
    }
}
