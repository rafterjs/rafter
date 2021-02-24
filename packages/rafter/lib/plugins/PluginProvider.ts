import { IDiAutoloader } from '@rafterjs/di-autoloader';
import { ILogger } from '@rafterjs/logger-plugin';
import { IPlugin, IPluginsConfig } from './IPlugin';

export interface IPluginProvider {
  createInstance(pluginConfig: IPluginsConfig): Promise<IPlugin | IPlugin[]>;
}

export class PluginProvider implements IPluginProvider {
  constructor(private readonly diAutoloader: IDiAutoloader, private readonly logger: ILogger) {}

  public async createInstance(pluginsConfig: IPluginsConfig): Promise<IPlugin | IPlugin[]> {
    const plugins: IPlugin | IPlugin[] = [];

    if (pluginsConfig.size > 0) {
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

export default PluginProvider;