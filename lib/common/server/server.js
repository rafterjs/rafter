/**
 * @param {object} express
 * @param {RoutesProvider} routerProvider
 * @param {MiddlewareProvider} middlewareProvider
 * @param {PreStartHooksProvider} preStartHookProvider
 * @param {string[]=} middlewareConfig
 * @param {object[]=} routesConfig
 * @param {Function[]=} preStartHooks
 * @param {number=} serverPort
 * @param {Logger} logger
 *
 * @return {Server}
 */
export default (
    express,
    routerProvider,
    middlewareProvider,
    preStartHookProvider,
    middlewareConfig = [],
    routesConfig = [],
    preStartHooks = [],
    serverPort = 3000,
    logger = console
) => {
    /**
     * @namespace Server
     */
    const Server = {};
    let serverInstance;

    /**
     * @return {Promise.<void>}
     */
    Server.start = async () => {
        if (!serverInstance) {
            // add all the middleware
            logger.info(`ExpressServer::start running pre-start hooks`);
            await initPreStartHooks();

            // add all the middleware
            logger.info(`ExpressServer::start applying middleware`);
            await initMiddleware();

            // add the router
            logger.info(`ExpressServer::start applying the router`);
            await initRoutes();

            return new Promise((resolve, reject) => {
                serverInstance = express.listen(serverPort, (error) => {
                    if (error) {
                        logger.error(error);
                        reject(error);
                    }

                    logger.info(`ExpressServer::start Server running on port ${serverPort}`);
                    resolve();
                });
            });
        } else {
            logger.warn(`ExpressServer::start Server is already running on port ${serverPort}`);
        }
    };

    /**
     * @return {Promise.<void>}
     */
    Server.stop = async () => {
        if (serverInstance) {
            serverInstance.close();
            serverInstance = undefined;
        }
    };

    /**
     * Runs all the pre start hooks that have been registered
     *
     * @private
     */
    async function initPreStartHooks() {
        if (preStartHooks.length > 0) {
            // get the hooks from config
            const hooks = preStartHookProvider.createInstance(
                preStartHooks
            );

            // run the hooks
            for (const hook of hooks) {
                await hook();
            }
        }
    }

    /**
     * Initializes all the middleware from the provided config.
     *
     * @private
     */
    async function initMiddleware() {
        if (middlewareConfig.length > 0) {
            express.use(
                middlewareProvider.createInstance(
                    middlewareConfig
                )
            );
        }
    }

    /**
     * @private
     */
    async function initRoutes() {
        if (routesConfig.length > 0) {
            express.use(
                routerProvider.createInstance(
                    routesConfig
                )
            );
        }
    }

    return Object.freeze(Server);
}
