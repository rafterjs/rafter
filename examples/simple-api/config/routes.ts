import { IRouteConfig, IRoutes } from '@rafterjs/api';

export default (): IRoutes =>
  new Set<IRouteConfig>([
    {
      endpoint: `/users`,
      controller: `usersController`,
      action: `index`,
      method: `get`,
    },
  ]);
