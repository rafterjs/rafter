import { IRouteConfig } from '../../../lib/common/router/IRouteConfig';

export default [
  {
    endpoint: `/`,
    controller: `homeController`,
    action: `index`,
    method: `get`,
  },
  {
    endpoint: `/other`,
    controller: `otherController`,
    action: `index`,
    method: `post`,
  },
] as IRouteConfig[];
