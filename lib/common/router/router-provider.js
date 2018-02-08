export default class ConfigExpressRouterProvider {
    /**
     * @param {ConfigToRouteDtoMapper} configToRouteDtoMapper
     * @param {ExpressRouterProvider} expressRouterProvider
     * @param {Logger} logger
     */
    constructor(
        configToRouteDtoMapper,
        expressRouterProvider,
        logger,
    ) {
        this._configToRouteDtoMapper = configToRouteDtoMapper;
        this._expressRouterProvider = expressRouterProvider;
        this._logger = logger;
    }

    /**
     * @param {object} routesConfig
     * @return {express.Router}
     */
    createInstance(routesConfig) {
        const routes = this._configToRouteDtoMapper.convert(routesConfig);
        const router = this._expressRouterProvider.createInstance();

        this._applyRoutes(router, routes);

        return router;
    }

    /**
     * @param {express.Router} router
     * @param {RouteDto[]} routes
     * @private
     */
    _applyRoutes(router, routes) {
        for (const route of routes) {
            router[route.getMethod()](route.getEndpoint(), route.getController());
            this._logger.info(`    Added route: ${route.getMethod().toUpperCase()} ${route.getEndpoint()}`);
        }
    }
}
