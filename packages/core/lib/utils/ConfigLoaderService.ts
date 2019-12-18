import { dirname, join } from 'path';
import { IConfigLoaderStrategy } from './IConfigLoaderStrategy';
import { IConfigLoaderService } from './IConfigLoaderService';
import { ILogger } from './ILogger';
import { IConfig } from './IConfig';
import { IPluginsConfig } from '../common/plugins/IPlugin';
import ConfigDto from './ConfigDto';
import { merge } from './ConfigUtils';

const RAFTER_AUTOLOADER_DIRECTORY = join(__dirname, '/../');

/**
 * A service that loads config for rafter
 */
export default class ConfigLoaderService implements IConfigLoaderService {
  private readonly configLoaderStrategy: IConfigLoaderStrategy;

  private readonly applicationDirectory: string;

  private readonly logger: ILogger;

  constructor(
    configLoaderStrategy: IConfigLoaderStrategy,
    applicationDirectory: string = join(__dirname, '/../../'),
    logger: ILogger = console,
  ) {
    this.configLoaderStrategy = configLoaderStrategy;
    this.applicationDirectory = applicationDirectory;
    this.logger = logger;
  }

  public async getConfig(): Promise<IConfig> {
    this.logger.debug('----------Load rafter dependencies config', RAFTER_AUTOLOADER_DIRECTORY);
    const config = await this.configLoaderStrategy.getConfig(RAFTER_AUTOLOADER_DIRECTORY);

    const applicationConfigDto = await this.loadConfigFromFiles(this.applicationDirectory);

    // TODO, split the app config loading and override because we actually want out App config to
    // take precedence. ??

    // merge the application config
    merge(config, applicationConfigDto);

    this.logger.info(`----------FINAL CONFIG`, config);

    return config;
  }

  private async loadConfigFromFiles(directory: string): Promise<IConfig> {
    // check dir exists
    if (!directory) {
      throw new Error(`Directory not found ${directory}`);
    }

    this.logger.info('----------DIR', directory);

    const config = await this.configLoaderStrategy.getConfig(directory);

    this.logger.info(`----------CONFIG ${directory}`, config);

    const pluginsConfig = await this.loadPluginsConfig(config.getPluginsConfig());

    merge(config, pluginsConfig);

    return config;
  }

  private async loadPluginsConfig(pluginsConfig: IPluginsConfig): Promise<IConfig> {
    this.logger.info(`Loading plugins`);
    const mergedPluginsConfig = new ConfigDto();

    // eslint-disable-next-line no-restricted-syntax
    for (const [key] of Object.entries(pluginsConfig)) {
      try {
        this.logger.info(`Loading plugin: ${key}`);

        const pluginPath = require.resolve(key, { paths: require.main?.paths });
        const pluginDirectory = dirname(pluginPath);

        this.logger.debug(`Loading dependencies for plugin from: ${pluginDirectory}`);
        // eslint-disable-next-line no-await-in-loop
        const pluginConfig = await this.loadConfigFromFiles(pluginDirectory);

        merge(mergedPluginsConfig, pluginConfig);
      } catch (exception) {
        this.logger.error(`Failed to load module ${key}`, exception);
      }
    }

    return mergedPluginsConfig;
  }
}
