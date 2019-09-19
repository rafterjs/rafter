import { IDiContainer } from '@rafter/di-container';
import { ILogger } from '../../utils/ILogger';
import { IPlugin, IPluginConfig } from './IPlugin';

export interface IPluginProvider {
  createInstance(pluginConfig: string[]): IPlugin | IPlugin[];
}

/**
 *
 * @param {IDiContainer} diContainer
 * @param {Logger} logger
 * @return {PluginProvider}
 */

export default class PluginProvider implements IPluginProvider {
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
  public createInstance(pluginsConfig: IPluginConfig): IPlugin | IPlugin[] {
    const plugins: IPlugin | IPlugin[] = [];

    console.log('--------------', pluginsConfig);
    return plugins;
  }
}
