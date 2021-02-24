import { IRouteConfig } from '../../../../../rafter/lib/server/common/router';

export const routes1 = (): IRouteConfig[] => [
  {
    endpoint: `/`,
    controller: `testController`,
    action: `index`,
    method: `get`,
  },
];

export default routes1;
