/**
 *
 */
export default class Server {
    /**
     * @param {object} express
     * @param {RoutesProvider} routerProvider
     * @param {ConfigMiddlewareProvider} middlewareProvider
     * @param {string[]=} middlewareConfig
     * @param {object[]=} routesConfig
     * @param {object=} config
     * @param {Logger} logger
     */
    constructor(
        express,
        routerProvider,
        middlewareProvider,
        middlewareConfig = [],
        routesConfig = [],
        config = {},
        logger = console
    ) {
        this._express = express;
        this._routerProvider = routerProvider;
        this._middlewareConfigProvider = middlewareProvider;

        this._middlewareConfig = middlewareConfig;
        this._routesConfig = routesConfig;
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
     * Initializes all the middleware from the provided config.
     *
     * @private
     */
    _initMiddleware() {
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
    _initRoutes() {
        if (this._routesConfig.length > 0) {
            this._express.use(
                this._routerProvider.createInstance(
                    this._routesConfig
                )
            );
        }
    }
}
