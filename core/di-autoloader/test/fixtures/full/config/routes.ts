import { IRouteConfig, IRoutes } from '../../../../../rafter/lib/server/common/router';

export const routes1 = (): IRoutes =>
  new Set<IRouteConfig>([
    {
      endpoint: `/`,
      controller: `testController`,
      action: `index`,
      method: `get`,
    },
  ]);

export default routes1;
