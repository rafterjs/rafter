import diAutoloaderFactory, { IDiAutoloader } from '@rafterjs/di-autoloader';
import Rafter, { RafterConfig, CORE_LIB_DIRECTORIES, CORE_PATH } from './Rafter';
import { IRafterOptions } from './IRafterOptions';
import { IRafter } from './IRafter';

export * from './common/errors';
export * from './common/helpers';
export * from './common/mappers';
export * from './common/middleware';
export * from './common/plugins';
export * from './common/pre-start-hooks';
export * from './common/router';
export * from './common/server';
export * from './vendor/express';
export { RafterConfig, IRafter, IRafterOptions, CORE_LIB_DIRECTORIES, CORE_PATH };

export default ({ corePath, paths, logger }: IRafterOptions): IRafter => {
  const diAutoloader: IDiAutoloader = diAutoloaderFactory({ logger });

  const config: RafterConfig = {
    diAutoloader,
    corePath,
    paths,
    logger,
  };
  return new Rafter(config);
};
