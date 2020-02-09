import { ILogger } from '../logger/ILogger';

export interface IDiConfigLoaderStrategyOptions {
  configFileName?: string;
  servicesFileName?: string;
  pluginsFileName?: string;
  middlewareFileName?: string;
  routesFileName?: string;
  preStartHooksFileName?: string;
  logger?: ILogger;
  failOnError?: boolean;
}
