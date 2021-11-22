import { IRouteConfig, IRoutes } from '../../../types';

export const routes2 = (): IRoutes =>
  new Set<IRouteConfig>([
    {
      endpoint: `/`,
      controller: `testController`,
      action: `index`,
      method: `get`,
    },
    {
      endpoint: `/test`,
      controller: `testController`,
      action: `index`,
      method: `get`,
    },
  ]);

export default routes2;
