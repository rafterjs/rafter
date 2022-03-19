import { ILogger, ILoggerFactory } from '@rafterjs/logger-plugin';
import { ConfigToRouteDtoTransformer } from './ConfigToRouteDtoTransformer';
import { IRouter } from '../../vendor';
import { IRoutes } from './IRouteConfig';
import { RouteDto } from './RouteDto';
import { RouterProvider } from './RouterProvider';

export interface IRoutesProvider {
  createInstance(routesConfig: IRoutes): IRouter;
}

export default class RoutesProvider implements IRoutesProvider {
  private readonly logger: ILogger;

  constructor(
    private readonly configToRouteDtoTransformer: ConfigToRouteDtoTransformer,
    private readonly routerProvider: RouterProvider,
    private readonly loggerFactory: ILoggerFactory,
  ) {
    this.logger = loggerFactory('routes provider');
  }

  public createInstance(routesConfig: IRoutes): IRouter {
    const routes = this.configToRouteDtoTransformer.convert(routesConfig);
    const router = this.routerProvider.createInstance();

    this.applyRoutes(router, routes);

    return router;
  }

  private applyRoutes(router: IRouter, routes: RouteDto[]): void {
    Object.values(routes).forEach(async (route): Promise<void> => {
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
}
