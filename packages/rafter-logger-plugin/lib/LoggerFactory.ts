import { getLogger } from 'log4js';
import { config, ILoggerConfig } from '../config/config';
import { ILogger } from './ILogger';

export type ILoggerFactory = (category?: string, overrideConfig?: ILoggerConfig) => ILogger;

export function loggerFactory(category?: string, overrideConfig?: ILoggerConfig): ILogger {
  const logger = getLogger(category);

  logger.level = overrideConfig?.logger?.level || config.logger.level;

  return logger;
}

export default (): ILoggerFactory => loggerFactory;
