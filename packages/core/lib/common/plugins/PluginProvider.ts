import { IDiContainer } from '@rafter/di-container';
import { ILogger } from '../../utils/logger/ILogger';
import { IPlugin, IPluginConfig, IPluginsConfig } from './IPlugin';

export interface IPluginProvider {
  createInstance(pluginConfig: IPluginsConfig): IPlugin | IPlugin[];
}

/**
 *
 * @param {IDiContainer} diContainer
 * @param {ILogger} logger
 * @return {PluginProvider}
 */

export default class PluginProvider<T extends IPluginConfig> implements IPluginProvider {
  private readonly diContainer: IDiContainer;

  private readonly logger: ILogger;

  constructor(diContainer: IDiContainer, logger: ILogger) {
    this.diContainer = diContainer;
    this.logger = logger;
  }

  /**
   * @param {IPluginConfig} pluginsConfig
   * @return {Function|Function[]}
   */
  public createInstance(pluginsConfig: IPluginsConfig): IPlugin | IPlugin[] {
    const plugins: IPlugin | IPlugin[] = [];

    Object.entries(pluginsConfig).forEach(([config, pluginName]): void => {
      this.logger.debug('-------------pluginName-', pluginName);
      this.logger.debug('-------------config-', config);
    });

    return plugins;
  }
}
