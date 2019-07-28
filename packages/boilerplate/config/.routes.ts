import { IRouteConfig } from '@rafter/core/lib/common/router/IRouteConfig';

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
    method: `get`,
  },
  {
    endpoint: `/api`,
    controller: `apiController`,
    action: `index`,
    method: `get`,
  },
] as IRouteConfig[];
