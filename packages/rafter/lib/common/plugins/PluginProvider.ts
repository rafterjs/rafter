import { IDiAutoloader } from '@rafterjs/di-autoloader';
import { ILogger } from '@rafterjs/utils';
import { dirname, join } from 'path';
import { IPlugin, IPluginConfig, IPluginsConfig } from './IPlugin';

export interface IPluginProvider {
  createInstance(pluginConfig: IPluginsConfig): Promise<IPlugin | IPlugin[]>;
}

/**
 * @param {IDiAutoloader} diContainer
 * @param {ILogger} logger
 * @return {PluginProvider}
 */

export default class PluginProvider<T extends IPluginConfig> implements IPluginProvider {
  private readonly diAutoloader: IDiAutoloader;

  private readonly logger: ILogger;

  constructor(diAutoloader: IDiAutoloader, logger: ILogger) {
    this.diAutoloader = diAutoloader;
    this.logger = logger;
  }

  /**
   * @param {IPluginConfig} pluginsConfig
   * @return {Function|Function[]}
   */
  public async createInstance(pluginsConfig: IPluginsConfig): Promise<IPlugin | IPlugin[]> {
    const plugins: IPlugin | IPlugin[] = [];

    const pluginConfigNames = Object.keys(pluginsConfig) || [];
    if (pluginConfigNames.length > 0) {
      // this.logger.debug(`    There are ${pluginConfigNames.length} plugins defined`, pluginConfigNames);
      // for (const name of pluginConfigNames) {
      //   try {
      //     const pluginMainPath = require.resolve(name);
      //     const pluginDirPath = dirname(pluginMainPath);
      //     this.logger.debug(`    The plugin ${name} is located in ${pluginDirPath}`);
      //     this.logger.info(`    Adding plugin: ${name}`);
      //
      //     await this.diAutoloader.load(
      //       [join(pluginDirPath, '/**/!(*.spec|*.d|index).@(ts|js)')]
      //     );
      //   } catch (error) {
      //     this.logger.error(`The plugin ${name} could not be initialized`, error);
      //   }
      // }
    }

    return plugins;
  }
}
