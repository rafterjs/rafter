import { IDiConfigLoaderStrategyOptions } from './utils/loader/IDiConfigLoaderStrategyOptions';

export interface IRafterOptions extends IDiConfigLoaderStrategyOptions {
  corePaths?: string;
  applicationPaths?: string;
}
