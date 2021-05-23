import { diAutoloaderFactory, IDiAutoloader } from '@rafterjs/di-autoloader';
import { loggerFactory } from '@rafterjs/logger-plugin';
import { IRafterOptions } from '../IRafterOptions';
import { PluginPathProvider } from '../plugins/PluginPathProvider';
import { IRafterConfig, Rafter } from '../Rafter';
import { IRafterServerless } from './IRafterServerless';
import {
  IRafterServerlessConfig,
  RafterServerless,
  SERVERLESS_CORE_PATH,
  SERVERLESS_DEFAULT_MERGABLE_FILENAME_VALUES,
} from './RafterServerless';

export function rafterServerlessFactory({
  corePath = SERVERLESS_CORE_PATH,
  paths,
  mergableFileNames = SERVERLESS_DEFAULT_MERGABLE_FILENAME_VALUES,
  logger = loggerFactory('rafter serverless'),
}: IRafterOptions): IRafterServerless {
  const diAutoloader: IDiAutoloader = diAutoloaderFactory({ logger });
  const pluginPathProvider = new PluginPathProvider();

  const rafterConfig: IRafterConfig = {
    diAutoloader,
    corePath,
    paths,
    mergableFileNames,
    pluginPathProvider,
    logger,
  };

  const rafter = new Rafter(rafterConfig);

  const rafterServerConfig: IRafterServerlessConfig = { rafter, logger };
  return new RafterServerless(rafterServerConfig);
}
