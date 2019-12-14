import { Box } from '@rafter/di-container';
import { IDiAutoloader } from '@rafter/di-autoloader';
import { ILogger } from './utils/ILogger';
import { IServer } from './common/server/Server';
import boxDiAutoloaderFactory from './vendor/BoxDiAutoloaderFactory';
import { IServiceConfig } from './common/IService';
import { IRouteConfig } from './common/router/IRouteConfig';
import { IMiddlewareConfig } from './common/middleware/IMiddleware';
import { IPreStartHookConfig } from './common/pre-start-hooks/IPreStartHook';
import { IConfigLoaderService } from './utils/IConfigLoaderService';

export interface RafterConfig {
  configLoaderService: IConfigLoaderService;
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

  private readonly configLoaderService: IConfigLoaderService;

  private readonly logger: ILogger;

  constructor(rafterConfig: RafterConfig) {
    const { configLoaderService, logger = console } = rafterConfig;

    this.configLoaderService = configLoaderService;
    this.logger = logger;
  }

  private async loadDependencies(): Promise<void> {
    const configDto = await this.configLoaderService.getConfig();
    // TODO namespace these DI services so they dont inadvertently be overloaded
    this.logger.debug('rafter::loadDependencies', configDto);

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

    this.boxDiAutoLoader = boxDiAutoloaderFactory(configDto.getServices(), this.logger);

    await this.boxDiAutoLoader.load();
  }

  public async start(): Promise<void> {
    await this.loadDependencies();

    if (this.boxDiAutoLoader) {
      this.server = this.boxDiAutoLoader.get<IServer>('server');

      await this.server.start();
    }
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
