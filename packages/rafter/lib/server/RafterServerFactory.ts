import { diAutoloaderFactory, IDiAutoloader } from '@rafterjs/di-autoloader';
import { loggerFactory } from '@rafterjs/logger-plugin';
import { IRafterOptions } from '../IRafterOptions';
import { IRafterServer } from './IRafterServer';
import { IRafterConfig, Rafter } from '../Rafter';
import {
  SERVER_CORE_PATH,
  SERVER_DEFAULT_MERGABLE_FILENAME_VALUES,
  IRafterServerConfig,
  RafterServer,
} from './RafterServer';
import { PluginPathProvider } from '../plugins/PluginPathProvider';

export function rafterServerFactory({
  corePath = SERVER_CORE_PATH,
  paths,
  mergableFileNames = SERVER_DEFAULT_MERGABLE_FILENAME_VALUES,
  logger = loggerFactory('rafter server'),
}: IRafterOptions): IRafterServer {
  const diAutoloader: IDiAutoloader = diAutoloaderFactory({ logger });
  const pluginPathProvider = new PluginPathProvider(logger);

  const rafterConfig: IRafterConfig = {
    diAutoloader,
    corePath,
    paths,
    mergableFileNames,
    pluginPathProvider,
    logger,
  };

  const rafter = new Rafter(rafterConfig);

  const rafterServerConfig: IRafterServerConfig = { rafter, logger };
  return new RafterServer(rafterServerConfig);
}
