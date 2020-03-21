import { ILogger } from '@rafter/utils';
import { IDiAutoloader } from '@rafter/di-autoloader';

export interface IRafterOptions {
  diAutoloader: IDiAutoloader;
  corePaths?: string;
  applicationPaths?: string;
  logger?: ILogger;
}
