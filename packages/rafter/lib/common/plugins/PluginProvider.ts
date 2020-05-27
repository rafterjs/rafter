import { IDiAutoloader } from '@rafterjs/di-autoloader';
import { ILogger } from '@rafterjs/utils';
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
      // TODO move the plugin logic from Rafter to here.
    }

    return plugins;
  }
}
