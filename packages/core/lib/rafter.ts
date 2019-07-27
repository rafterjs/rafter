import { join } from 'path';
import { Box } from '@rafter/di-container';
import { IDiAutoloader } from '@rafter/di-autoloader';
import { ILogger } from './utils/ILogger';
import { IConfigAutoloader } from './utils/IConfigAutoloader';
import { IServer } from './common/server/Server';
import boxDiAutoloaderFactory from './vendor/BoxDiAutoloaderFactory';
import ConfigDto from './utils/ConfigDto';
import { IServiceConfig } from './common/IService';
import { IRouteConfig } from './common/router/IRouteConfig';
import { IMiddleWareConfig } from './common/middleware/IMiddleware';
import { IPreStartHookConfig } from './common/pre-start-hooks/IPreStartHook';

const RAFTER_AUTOLOADER_DIRECTORY = __dirname;

export interface RafterConfig {
  appDirectory?: string;
  configAutoloaderService: IConfigAutoloader;
  logger?: ILogger;
}

/**
 *
 * @param {string=} appDirectory This is the directory your application is located. Most of the time it
 *     will be 2 directories up from where Rafter is located, but that is not always the case.
 * @param {ConfigAutoloaderService} configAutoloaderService
 * @param {Logger=} logger a logging interface eg. winston, console, etc
 * @return {Rafter}
 */
export default class Rafter {
  private boxDiAutoLoader?: IDiAutoloader;

  private server?: IServer;

  private readonly appDirectory: string;

  private readonly configAutoloaderService: IConfigAutoloader;

  private readonly logger: ILogger;

  constructor(rafterConfig: RafterConfig) {
    const { appDirectory = join(__dirname, '/../../'), configAutoloaderService, logger = console } = rafterConfig;

    this.appDirectory = appDirectory;
    this.configAutoloaderService = configAutoloaderService;
    this.logger = logger;
  }

  /**
   * @return {Promise<ConfigDto>}
   * @private
   */
  private async getConfig(): Promise<ConfigDto> {
    // load rafter config files first
    const configDto = await this.configAutoloaderService.get(RAFTER_AUTOLOADER_DIRECTORY);

    // load application specific config
    if (this.appDirectory) {
      const applicationConfigDto = await this.configAutoloaderService.get(this.appDirectory);

      // merge the application config
      configDto
        .addConfig(applicationConfigDto.getConfig())
        .addServices(applicationConfigDto.getServices())
        .addMiddleware(applicationConfigDto.getMiddleware())
        .addPreStartHooks(applicationConfigDto.getPreStartHooks())
        .addRoutes(applicationConfigDto.getRoutes());
    }

    return configDto;
  }

  private async getAutoloader(): Promise<IDiAutoloader> {
    const configDto = await this.getConfig();
    // TODO namespace these DI services so they dont inadvertently be overloaded

    // add the config to the DI container
    Box.register('config', (): object => configDto.getConfig());

    // add the services to the DI container
    Box.register('services', (): IServiceConfig => configDto.getServices());

    // add the routes to the DI container
    Box.register('routes', (): IRouteConfig[] => configDto.getRoutes());

    // add the middleware to the DI container
    Box.register('middleware', (): IMiddleWareConfig[] => configDto.getMiddleware());

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
