/**
 *
 * @param {ConfigToRouteDtoTransformer} configToRouteDtoTransformer
 * @param {RouterProvider} routerProvider
 * @param {Logger} logger
 * @return {RoutesProvider}
 */
export default (configToRouteDtoTransformer, routerProvider, logger) => {
  /**
   * @namespace RoutesProvider
   */
  const RoutesProvider = {};

  /**
   * @param {express.Router} router
   * @param {RouteDto[]} routes
   * @private
   */
  function applyRoutes(router, routes) {
    Object.values(routes).forEach(async route => {
      const controller = route.getController();

      // add the route to the router
      if (router[route.getMethod()]) {
        router[route.getMethod()](route.getEndpoint(), controller.bind(controller));

        logger.info(`    Added route: ${route.getMethod().toUpperCase()} ${route.getEndpoint()}`);
      } else {
        logger.error(`    Failed to add route: ${route.getMethod().toUpperCase()} ${route.getEndpoint()}`);
      }
    });
  }

  /**
   * @param {object} routesConfig
   * @return {express.Router}
   */
  RoutesProvider.createInstance = routesConfig => {
    const routes = configToRouteDtoTransformer.convert(routesConfig);
    const router = routerProvider.createInstance();

    applyRoutes(router, routes);

    return router;
  };

  return Object.freeze(RoutesProvider);
};
