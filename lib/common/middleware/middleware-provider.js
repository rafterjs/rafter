/**
 *
 */
export default class MiddlewareProvider {
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
     * @param {string[]} middlewareConfig
     * @return {Function[]|Array[]}
     */
    createInstance(middlewareConfig) {
        const middlewareCollection = [];
        for (const middlewareServiceName of middlewareConfig) {
            try {
                this._logger.info(`    Adding middleware: ${middlewareServiceName}`);
                const middleware = this._diContainer.get(middlewareServiceName);
                middlewareCollection.push(middleware);
            } catch (error) {
                this._logger.error(`    Could not add middleware: ${middlewareServiceName}`, error);
            }
        }

        return middlewareCollection;
    }
}
