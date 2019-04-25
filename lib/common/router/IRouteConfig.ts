import {METHOD} from './RouteMethodConstants';

export type IRouteConfig = {
  endpoint: string;
  controller: string;
  action: string;
  method: METHOD,
}