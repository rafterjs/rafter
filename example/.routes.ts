import { METHOD } from '../packages/core/lib/common/router/RouteMethodConstants';
import { IRouteConfig } from '../packages/core/lib/common/router/IRouteConfig';

export default [
  {
    endpoint: `/`,
    controller: 'exampleController',
    action: 'index',
    method: METHOD.GET,
  } as IRouteConfig,
];
