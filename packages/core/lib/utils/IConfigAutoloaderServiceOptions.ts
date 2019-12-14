import { ILogger } from './ILogger';

export interface IConfigAutoloaderServiceOptions {
  configFileName?: string;
  servicesFileName?: string;
  pluginsFileName?: string;
  middlewareFileName?: string;
  routesFileName?: string;
  preStartHooksFileName?: string;
  logger?: ILogger;
  failOnError?: boolean;
}