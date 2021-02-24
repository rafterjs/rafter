import { diAutoloaderFactory, IDiAutoloader } from '@rafterjs/di-autoloader';
import { loggerFactory } from '@rafterjs/logger-plugin';

import { IRafterOptions } from '../IRafterOptions';
import { IRafterServer } from '../server/IRafterServer';

import { IRafterConfig, Rafter } from '../Rafter';
import {
  SERVERLESS_CORE_PATH,
  SERVERLESS_DEFAULT_MERGABLE_FILENAME_VALUES,
  IRafterCliConfig,
  RafterServerlessCli,
} from './RafterServerlessCli';
import { PluginProvider } from '../plugins/PluginProvider';

export function rafterServerlessFactory({
  corePath = SERVERLESS_CORE_PATH,
  paths,
  mergableFileNames = SERVERLESS_DEFAULT_MERGABLE_FILENAME_VALUES,
  logger = loggerFactory('rafter serverless'),
}: IRafterOptions): IRafterServer {
  const diAutoloader: IDiAutoloader = diAutoloaderFactory({ logger });
  const pluginProvider = new PluginProvider(diAutoloader, logger);

  const rafterConfig: IRafterConfig = {
    diAutoloader,
    corePath,
    paths,
    mergableFileNames,
    pluginProvider,
    logger,
  };

  const rafter = new Rafter(rafterConfig);

  const rafterServerConfig: IRafterCliConfig = { rafter, logger };
  return new RafterServerlessCli(rafterServerConfig);
}
