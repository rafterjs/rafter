import { dirname, join } from 'path';
import { IConfigLoaderStrategy } from './IConfigLoaderStrategy';
import { IConfigLoaderService } from './IConfigLoaderService';
import { ILogger } from './ILogger';
import { IConfig } from './IConfig';

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
    const configDto = await this.configLoaderStrategy.getConfig(RAFTER_AUTOLOADER_DIRECTORY);

    await this.loadConfigFromFiles(configDto);

    return configDto;
  }

  private async loadConfigFromFiles(
    configDto: IConfig,
    applicationDirectory: string = this.applicationDirectory,
  ): Promise<void> {
    // load application config
    if (applicationDirectory) {
      this.logger.info('----------APP DIR', applicationDirectory);

      const applicationConfigDto = await this.configLoaderStrategy.getConfig(applicationDirectory);
      this.logger.info('----------APP CONFIG', applicationConfigDto);

      // merge the application config
      configDto
        .addConfig(applicationConfigDto.getConfig())
        .addPlugins(applicationConfigDto.getPlugins())
        .addServices(applicationConfigDto.getServices())
        .addMiddleware(applicationConfigDto.getMiddleware())
        .addPreStartHooks(applicationConfigDto.getPreStartHooks())
        .addRoutes(applicationConfigDto.getRoutes());

      this.logger.info('----------compiledConfig', configDto.getMiddleware(), applicationConfigDto.getMiddleware());
    }

    this.loadPlugins(configDto);

    this.logger.info('----------END');
  }

  private async loadPlugins(configDto: IConfig): Promise<void> {
    this.logger.info(`Loading plugins`);

    // eslint-disable-next-line no-restricted-syntax
    for (const [key] of Object.entries(configDto.getPlugins())) {
      try {
        this.logger.info(`Loading module: ${key}`);
        const pluginPath = dirname(require.resolve(key));
        this.logger.debug(`Loading dependencies for module from: ${pluginPath}`);

        this.logger.debug(`-------load plugins from ${key}`);
        // eslint-disable-next-line no-await-in-loop
        await this.loadConfigFromFiles(configDto, pluginPath);

        // TODO add module config after dependencies so overrides will happen
        this.logger.debug(`-------END ${key}`);
      } catch (exception) {
        this.logger.error(`Failed to load module ${key}`);
        this.logger.debug(`------- ${key} exception`, exception);
      }
    }
  }
}
