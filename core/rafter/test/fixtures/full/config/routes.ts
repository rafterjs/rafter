import { IRouteConfig, METHODS } from '../../../../lib/server/common/router';

const routes = (): IRouteConfig[] => [
  {
    endpoint: `/`,
    controller: `homeController`,
    action: `index`,
    method: METHODS.get,
  },
];

export default routes;
