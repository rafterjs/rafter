import { ILogger } from '@rafter/utils';
import { GlobWithOptions } from 'awilix';

export interface IRafterOptions {
  corePath?: GlobWithOptions | string;
  paths?: Array<string | GlobWithOptions>;
  logger?: ILogger;
}
