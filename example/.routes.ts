import {METHOD} from '../lib/common/router/RouteMethodConstants';
import {IRouteConfig} from '../lib/common/router/IRouteConfig';

export default [
  {
    endpoint: `/`,
    controller: 'exampleController',
    action: 'index',
    method: METHOD.GET
  } as IRouteConfig
];
