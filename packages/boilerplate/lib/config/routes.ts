import { IRouteConfig } from 'rafter';

export default (): IRouteConfig[] => [
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
];
