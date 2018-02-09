export default class RoutesProvider {
    /**
     * @param {ConfigToRouteDtoTransformer} configToRouteDtoTransformer
     * @param {RouterProvider} routerProvider
     * @param {Logger} logger
     */
    constructor(
        configToRouteDtoTransformer,
        routerProvider,
        logger,
    ) {
        this._configToRouteDtoTransformer = configToRouteDtoTransformer;
        this._routerProvider = routerProvider;
        this._logger = logger;
    }

    /**
     * @param {object} routesConfig
     * @return {express.Router}
     */
    createInstance(routesConfig) {
        const routes = this._configToRouteDtoTransformer.convert(routesConfig);
        const router = this._routerProvider.createInstance();

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
