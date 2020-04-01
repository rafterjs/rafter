import { ILogger } from '@rafterjs/utils';
import { GlobWithOptions } from 'awilix';

export interface IRafterOptions {
  corePath?: GlobWithOptions | string;
  paths?: Array<string | GlobWithOptions>;
  logger?: ILogger;
}
