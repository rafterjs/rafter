import diAutoloaderFactory, { IDiAutoloader } from '@rafterjs/di-autoloader';
import consoleLoggerFactory from '@rafterjs/logger-plugin';

import Rafter, {
  CORE_LIB_DIRECTORIES,
  CORE_PATH,
  DEFAULT_MERGABLE_FILENAME_VALUES,
  DEFAULT_MERGABLE_FILENAMES,
  RafterConfig,
} from './Rafter';

import { IRafterOptions } from './IRafterOptions';
import { IRafter } from './IRafter';
import PluginProvider from './common/plugins/PluginProvider';

export * from './common/errors';
export * from './common/helpers';
export * from './common/mappers';
export * from './common/middleware';
export * from './common/plugins';
export * from './common/pre-start-hooks';
export * from './common/router';
export * from './common/server';
export * from './vendor/express';
export {
  RafterConfig,
  IRafter,
  IRafterOptions,
  DEFAULT_MERGABLE_FILENAMES,
  DEFAULT_MERGABLE_FILENAME_VALUES,
  CORE_LIB_DIRECTORIES,
  CORE_PATH,
};

export default ({
  corePath,
  paths,
  mergableFileNames = DEFAULT_MERGABLE_FILENAME_VALUES,
  logger = consoleLoggerFactory(),
}: IRafterOptions): IRafter => {
  const diAutoloader: IDiAutoloader = diAutoloaderFactory({ logger });

  const pluginProvider = new PluginProvider(diAutoloader, logger);

  const config: RafterConfig = {
    diAutoloader,
    corePath,
    paths,
    mergableFileNames,
    pluginProvider,
    logger,
  };

  return new Rafter(config);
};
