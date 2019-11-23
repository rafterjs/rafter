import { IDiContainer } from '@rafter/di-container';
import { ILogger } from '../../utils/ILogger';
import { IPlugin, IPluginConfig } from './IPlugin';

export interface IPluginProvider<T> {
  createInstance(pluginConfig: IPluginConfig<T>): IPlugin<T> | IPlugin<T>[];
}

/**
 *
 * @param {IDiContainer} diContainer
 * @param {ILogger} logger
 * @return {PluginProvider}
 */

export default class PluginProvider<T> implements IPluginProvider<T> {
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
  public createInstance(pluginsConfig: IPluginConfig<T>): IPlugin<T> | IPlugin<T>[] {
    const plugins: IPlugin<T> | IPlugin<T>[] = [];

    Object.entries(pluginsConfig).forEach(([config, pluginName]): void => {
      this.logger.debug('-------------pluginName-', pluginName);
      this.logger.debug('-------------config-', config);
    });

    return plugins;
  }
}
