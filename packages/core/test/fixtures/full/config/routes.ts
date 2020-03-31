import { IRouteConfig, METHODS } from '../../../../lib/common/router';

const routes = (): IRouteConfig[] => [
  {
    endpoint: `/`,
    controller: `homeController`,
    action: `index`,
    method: METHODS.get,
  },
];

export default routes;
