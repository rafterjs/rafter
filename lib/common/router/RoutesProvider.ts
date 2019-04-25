import ConfigToRouteDtoTransformer from './ConfigToRouteDtoTransformer';
import RouterProvider from './RouterProvider';
import {ILogger} from '../../utils/ILogger';
import {IRouter} from 'express-serve-static-core';
import RouteDto from './RouteDto';
import {IRouteConfig} from './IRouteConfig';

/**
 *
 * @param {ConfigToRouteDtoTransformer} configToRouteDtoTransformer
 * @param {RouterProvider} routerProvider
 * @param {ILogger} logger
 * @return {RoutesProvider}
 */
export default class RoutesProvider {
  configToRouteDtoTransformer: ConfigToRouteDtoTransformer;
  routerProvider: RouterProvider;
  logger: ILogger;

  constructor(configToRouteDtoTransformer: ConfigToRouteDtoTransformer, routerProvider: RouterProvider, logger: ILogger) {
    this.configToRouteDtoTransformer = configToRouteDtoTransformer;
    this.routerProvider = routerProvider;
    this.logger = logger;
  }

  /**
   * @param {IRouter} router
   * @param {RouteDto[]} routes
   * @private
   */
  private applyRoutes(router: IRouter, routes: RouteDto[]) {
    Object.values(routes)
      .forEach(async route => {
        const controller = route.getController();

        // add the route to the router
        if (router[route.getMethod()]) {
          router[route.getMethod()](route.getEndpoint(), controller.bind(controller));

          this.logger.info(`    Added route: ${route.getMethod().toUpperCase()} ${route.getEndpoint()}`);
        } else {
          this.logger.error(`    Failed to add route: ${route.getMethod().toUpperCase()} ${route.getEndpoint()}`);
        }
      });
  }

  /**
   * @param {IRouteConfig[]} routesConfig
   * @return {IRouter}
   */
  public createInstance(routesConfig: IRouteConfig[]) {
    const routes = this.configToRouteDtoTransformer.convert(routesConfig);
    const router = this.routerProvider.createInstance();

    this.applyRoutes(router, routes);

    return router;
  }
}
