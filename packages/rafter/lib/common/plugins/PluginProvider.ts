import { IDiAutoloader } from '@rafterjs/di-autoloader';
import { ILogger } from '@rafterjs/logger-plugin';
import { IPlugin, IPluginConfig, IPluginsConfig } from './IPlugin';

export interface IPluginProvider {
  createInstance(pluginConfig: IPluginsConfig): Promise<IPlugin | IPlugin[]>;
}

export default class PluginProvider<T extends IPluginConfig> implements IPluginProvider {
  private readonly diAutoloader: IDiAutoloader;

  private readonly logger: ILogger;

  constructor(diAutoloader: IDiAutoloader, logger: ILogger) {
    this.diAutoloader = diAutoloader;
    this.logger = logger;
  }

  public async createInstance(pluginsConfig: IPluginsConfig): Promise<IPlugin | IPlugin[]> {
    const plugins: IPlugin | IPlugin[] = [];

    if (pluginsConfig.length > 0) {
      this.logger.debug(`   Found plugin configs`, plugins);

      for (const pluginConfig of pluginsConfig) {
        try {
          const { name, path } = pluginConfig;
          let plugin;
          if (module.parent && module.parent.parent) {
            this.logger.debug(`Importing plugin ${name} via module.parent`);
            plugin = module.parent.parent.require(path);
          } else {
            this.logger.debug(`Importing plugin ${name} via require.resolve`);
            plugin = require.resolve(pluginConfig.path);
          }

          if (plugin && plugin.default) {
            this.diAutoloader.register(name, plugin.default);
          }
        } catch (error) {
          this.logger.error(`The plugin ${pluginConfig.name} could not be initialized`, error);
        }
      }
    }

    return plugins;
  }
}
