import { IRouteConfig, IRoutes } from '../';

export default (): IRoutes =>
  new Set<IRouteConfig>([
    {
      endpoint: `/`,
      controller: `homeController`,
      action: `index`,
      method: `get`,
    },
  ]);
