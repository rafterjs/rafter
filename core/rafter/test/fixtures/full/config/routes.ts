import { IRouteConfig, METHODS } from '../../../../lib';

const routes = (): IRouteConfig[] => [
  {
    endpoint: `/`,
    controller: `homeController`,
    action: `index`,
    method: METHODS.get,
  },
];

export default routes;
