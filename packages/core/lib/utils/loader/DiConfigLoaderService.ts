import { dirname, join } from 'path';
import { ILogger } from '@rafter/utils';
import { IDiConfigLoaderStrategy } from './IDiConfigLoaderStrategy';
import { IDiConfigLoaderService } from './IDiConfigLoaderService';
import { IConfig } from './IConfig';
import { IPluginsConfig } from '../../common/plugins/IPlugin';
import DiConfigDto from './DiConfigDto';
import { mergeDiConfig } from './configHelpers';

const RAFTER_AUTOLOADER_DIRECTORY = join(__dirname, '/../');

/**
 * A service that loads t config for rafter
 */
export default class DiConfigLoaderService implements IDiConfigLoaderService {
  private readonly diConfigLoaderStrategy: IDiConfigLoaderStrategy;

  private readonly applicationDirectory: string;

  private readonly logger: ILogger;

  constructor(
    configLoaderStrategy: IDiConfigLoaderStrategy,
    applicationDirectory: string = join(__dirname, '/../../'),
    logger: ILogger = console,
  ) {
    this.diConfigLoaderStrategy = configLoaderStrategy;
    this.applicationDirectory = applicationDirectory;
    this.logger = logger;
  }

  public async getDiConfig(): Promise<IConfig> {
    this.logger.debug('----------Load rafter dependencies config', RAFTER_AUTOLOADER_DIRECTORY);
    const config = await this.diConfigLoaderStrategy.getConfigFromDirectory(RAFTER_AUTOLOADER_DIRECTORY);

    const applicationConfigDto = await this.loadConfigFromDirectory(this.applicationDirectory);

    // TODO, split the app config loading and override because we actually want out App config to
    // take precedence. ??

    // mergeDiConfig the application config
    mergeDiConfig(config, applicationConfigDto);

    this.logger.info(`----------FINAL CONFIG`, config);

    return config;
  }

  private async loadConfigFromDirectory(directory: string): Promise<IConfig> {
    // check dir exists
    if (!directory) {
      throw new Error(`Directory not found ${directory}`);
    }

    this.logger.info('----------DIR', directory);

    const config = await this.diConfigLoaderStrategy.getConfigFromDirectory(directory);

    this.logger.info(`----------CONFIG ${directory}`, config);

    const pluginsConfig = await this.loadPluginsConfig(config.getPluginsConfig());

    mergeDiConfig(config, pluginsConfig);

    return config;
  }

  private async loadPluginsConfig(pluginsConfig: IPluginsConfig): Promise<IConfig> {
    this.logger.info(`Loading plugins`);
    const mergedPluginsConfig = new DiConfigDto();

    // eslint-disable-next-line no-restricted-syntax
    for (const [key] of Object.entries(pluginsConfig)) {
      try {
        this.logger.info(`Loading plugin: ${key}`);

        const pluginPath = require.resolve(key, { paths: require.main?.paths });
        const pluginDirectory = dirname(pluginPath);

        this.logger.debug(`Loading dependencies for plugin from: ${pluginDirectory}`);
        // eslint-disable-next-line no-await-in-loop
        const pluginConfig = await this.loadConfigFromDirectory(pluginDirectory);

        mergeDiConfig(mergedPluginsConfig, pluginConfig);
      } catch (exception) {
        this.logger.error(`Failed to load module ${key}`, exception);
      }
    }

    return mergedPluginsConfig;
  }
}
