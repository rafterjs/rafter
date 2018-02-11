/**
 *
 */
export default class Server {
    /**
     * @param {object} express
     * @param {RoutesProvider} routerProvider
     * @param {MiddlewareProvider} middlewareProvider
     * @param {PreStartHooksProvider} preStartHookProvider
     * @param {string[]=} middlewareConfig
     * @param {object[]=} routesConfig
     * @param {Function[]=} preStartHooks
     * @param {object=} config
     * @param {Logger} logger
     */
    constructor(
        express,
        routerProvider,
        middlewareProvider,
        preStartHookProvider,
        middlewareConfig = [],
        routesConfig = [],
        preStartHooks = [],
        config = {},
        logger = console
    ) {
        this._express = express;
        this._routerProvider = routerProvider;
        this._middlewareConfigProvider = middlewareProvider;
        this._preStartHookProvider = preStartHookProvider;

        this._middlewareConfig = middlewareConfig;
        this._routesConfig = routesConfig;
        this._preStartHooks = preStartHooks;
        this._config = config;

        this._logger = logger;
        this._server;
    }

    /**
     * @return {Promise.<void>}
     */
    async start() {
        if (!this._server) {
            // add all the middleware
            this._logger.info(`ExpressServer::start running pre-start hooks`);
            await this._initPreStartHooks();

            // add all the middleware
            this._logger.info(`ExpressServer::start applying middleware`);
            await this._initMiddleware();

            // add the router
            this._logger.info(`ExpressServer::start applying the router`);
            await this._initRoutes();

            return new Promise((resolve, reject) => {
                this._server = this._express.listen(this._config.server.port, (error) => {
                    if (error) {
                        this._logger.error(error);
                        reject(error);
                    }
                    this._logger.info(`ExpressServer::start Server running on port ${this._config.server.port}`);
                    resolve();
                });
            });
        } else {
            this._logger.warn(`ExpressServer::start Server is already running on port ${this._config.server.port}`);
        }
    }

    /**
     * @return {Promise.<void>}
     */
    async stop() {
        if (this._server) {
            this._server.close();
            delete this._server;
        }
    }

    /**
     * Runs all the pre start hooks that have been registered
     *
     * @private
     */
    async _initPreStartHooks() {
        if (this._preStartHooks.length > 0) {
            // get the hooks from config
            const hooks = this._preStartHookProvider.createInstance(
                this._preStartHooks
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
    async _initMiddleware() {
        if (this._middlewareConfig.length > 0) {
            this._express.use(
                this._middlewareConfigProvider.createInstance(
                    this._middlewareConfig
                )
            );
        }
    }

    /**
     * @private
     */
    async _initRoutes() {
        if (this._routesConfig.length > 0) {
            this._express.use(
                this._routerProvider.createInstance(
                    this._routesConfig
                )
            );
        }
    }
}
