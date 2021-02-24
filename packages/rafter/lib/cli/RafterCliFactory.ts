import { diAutoloaderFactory, IDiAutoloader } from '@rafterjs/di-autoloader';
import { loggerFactory } from '@rafterjs/logger-plugin';

import { IRafterOptions } from '../IRafterOptions';
import { IRafterServer } from '../server/IRafterServer';

import { IRafterConfig, Rafter } from '../Rafter';
import { CLI_CORE_PATH, CLI_DEFAULT_MERGABLE_FILENAME_VALUES, IRafterCliConfig, RafterCli } from './RafterCli';
import { PluginProvider } from '../plugins/PluginProvider';

export function rafterCliFactory({
  corePath = CLI_CORE_PATH,
  paths,
  mergableFileNames = CLI_DEFAULT_MERGABLE_FILENAME_VALUES,
  logger = loggerFactory('rafter cli'),
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
  return new RafterCli(rafterServerConfig);
}
