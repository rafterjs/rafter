import { join, dirname } from 'path';
import { Box } from '@rafter/di-container';
import { IDiAutoloader } from '@rafter/di-autoloader';
import { ILogger } from './utils/ILogger';
import { IConfigAutoloader } from './utils/IConfigAutoloader';
import { IServer } from './common/server/Server';
import boxDiAutoloaderFactory from './vendor/BoxDiAutoloaderFactory';
import ConfigDto from './utils/ConfigDto';
import { IServiceConfig } from './common/IService';
import { IRouteConfig } from './common/router/IRouteConfig';
import { IMiddlewareConfig } from './common/middleware/IMiddleware';
import { IPreStartHookConfig } from './common/pre-start-hooks/IPreStartHook';
import { IConfig } from './utils/IConfig';

const RAFTER_AUTOLOADER_DIRECTORY = __dirname;

export interface RafterConfig {
  appDirectory?: string;
  configAutoloaderService: IConfigAutoloader;
  logger?: ILogger;
}

/**
 *
 * @param {string=} appDirectory This is the directory your application is located. Most of the
 *   time it will be 2 directories up from where Rafter is located, but that is not always the
 *   case.
 * @param {RafterConfig} rafterConfig
 * @return {Rafter}
 */
export default class Rafter {
  private boxDiAutoLoader?: IDiAutoloader;

  private server?: IServer;

  private readonly appDirectory: string;

  private readonly configAutoloaderService: IConfigAutoloader;

  private readonly logger: ILogger;

  constructor(rafterConfig: RafterConfig) {
    const {
      // TODO there may be a better way to get to the app dir without assuming it's 2 levels up
      appDirectory = join(__dirname, '/../../'),
      configAutoloaderService,
      logger = console,
    } = rafterConfig;

    this.appDirectory = appDirectory;
    this.configAutoloaderService = configAutoloaderService;
    this.logger = logger;
  }

  /**
   * @return {Promise<ConfigDto>}
   * @private
   */
  private async getConfig(
    loadRafterConfig = true,
    applicationDirectory: string = this.appDirectory,
    configDto?: ConfigDto,
  ): Promise<ConfigDto> {
    let compiledConfig: ConfigDto = new ConfigDto();
    this.logger.info('----------LOADING');

    // load rafter config files first. These are the services that load in the application
    // dependencies.
    if (loadRafterConfig) {
      this.logger.info('----------RAFTER CONFIG');
      compiledConfig = await this.configAutoloaderService.getConfigFromDirectory(
        RAFTER_AUTOLOADER_DIRECTORY);
    }

    // load application config
    if (applicationDirectory) {
      this.logger.info('----------APP DIR', applicationDirectory);

      const applicationConfigDto = await this.configAutoloaderService.getConfigFromDirectory(
        applicationDirectory);
      this.logger.info('----------APP CONFIG', applicationConfigDto);

      // merge the application config
      compiledConfig
        .addConfig(applicationConfigDto.getConfig())
        .addPlugins(applicationConfigDto.getPlugins())
        .addServices(applicationConfigDto.getServices())
        .addMiddleware(applicationConfigDto.getMiddleware())
        .addPreStartHooks(applicationConfigDto.getPreStartHooks())
        .addRoutes(applicationConfigDto.getRoutes());

      this.logger.info(
        '----------compiledConfig',
        compiledConfig.getMiddleware(),
        applicationConfigDto.getMiddleware(),
      );
    }

    // TODO rip this bad boy out.
    for (const [key, config] of Object.entries(compiledConfig.getPlugins())) {
      try {
        this.logger.info(`Loading module: ${key}`);
        const pluginPath = dirname(require.resolve(key));
        this.logger.debug(`Loading dependencies for module from: ${pluginPath}`);

        // TODO, dont make it mutate, but combine after each iteration. This is potentially
        // slow, but we can speed it up by having a dependency cache. compiledConfig = this.l
        this.logger.debug(`-------START ${key}`);
        await this.getConfig(false, pluginPath, compiledConfig);

        // TODO add module config after dependencies so overrides will happen
        this.logger.debug(`-------END ${key}`);

      } catch (exception) {
        this.logger.error(`Failed to load module ${key}`);
        this.logger.debug(`------- ${key} exception`, exception);
      }
    }

    this.logger.info('----------END');
    return compiledConfig;
  }

  private async getAutoloader(): Promise<IDiAutoloader> {
    const configDto = await this.getConfig();
    // TODO namespace these DI services so they dont inadvertently be overloaded
    this.logger.info('---------------------------AUTOLOADER', configDto);

    // add the config to the DI container
    Box.register('config', (): object => configDto.getConfig());

    // add the services to the DI container
    Box.register('services', (): IServiceConfig => configDto.getServices());

    // add the routes to the DI container
    Box.register('routes', (): IRouteConfig[] => configDto.getRoutes());

    // add the middleware to the DI container
    Box.register('middleware', (): IMiddlewareConfig[] => configDto.getMiddleware());

    // add the middleware to the DI container
    Box.register('preStartHooks', (): IPreStartHookConfig[] => configDto.getPreStartHooks());
    return boxDiAutoloaderFactory(configDto.getServices(), this.logger);
  }

  public async start(): Promise<void> {
    this.boxDiAutoLoader = await this.getAutoloader();
    await this.boxDiAutoLoader.load();

    this.server = this.boxDiAutoLoader.get<IServer>('server');
    return this.server.start();
  }

  /**
   * @return {Promise}
   */
  public async stop(): Promise<void> {
    if (this.server) {
      // TODO empty the service container
      // boxDiAutoLoader.reset();
      return this.server.stop();
    }

    throw new Error('Rafter::stop the server has not been started');
  }
}
