export default class ExpressServer {
    /**
     * @param {object} express
     * @param {MongooseDbDao} dbDao
     * @param {ConfigExpressRouterProvider} routerProvider
     * @param {ConfigMiddlewareProvider} middlewareProvider
     * @param {Function[]=} middleware
     * @param {object[]=} routes
     * @param {object=} config
     * @param {Logger} logger
     */
    constructor(
        express,
        dbDao,
        routerProvider,
        middlewareProvider,
        middleware = [],
        routes = [],
        config = {},
        logger = console
    ) {
        this._express = express;
        this._dbDao = dbDao;
        this._routerProvider = routerProvider;
        this._middlewareProvider = middlewareProvider;
        this._middleware = middleware;
        this._routes = routes;
        this._config = config;
        this._logger = logger;
        this._server;
    }

    /**
     * @return {Promise.<void>}
     */
    async start() {
        if (!this._server) {
            // ensure there's a db connection
            this._logger.info(`ExpressServer::start connecting to db`);
            await this._dbDao.connect();

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
     * @private
     */
    _initMiddleware() {
        if (this._middleware.length > 0) {
            this._express.use(
                this._middlewareProvider.createInstance(
                    this._middleware
                )
            );
        }
    }

    /**
     * @private
     */
    _initRoutes() {
        if (this._routes.length > 0) {
            this._express.use(
                this._routerProvider.createInstance(
                    this._routes
                )
            );
        }
    }
}
