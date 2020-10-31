import { IRouteConfig } from '../../../../../rafter/lib/common/router';

export const routes2 = (): IRouteConfig[] => [
  {
    endpoint: `/test`,
    controller: `testController`,
    action: `index`,
    method: `get`,
  },
];

export default routes2;
