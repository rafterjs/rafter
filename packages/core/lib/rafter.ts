import { IDiAutoloader } from '@rafter/di-autoloader';
import { ILogger } from './utils/logger/ILogger';
import { IServer } from './common/server/Server';
import diAutoloaderFactory from './vendor/DiAutoloaderFactory';
import containerFactory from './vendor/ContainerFactory';
// import { IServiceConfig } from './common/IService';
// import { IRouteConfig } from './common/router/IRouteConfig';
// import { IMiddlewareConfig } from './common/middleware/IMiddleware';
// import { IPreStartHookConfig } from './common/pre-start-hooks/IPreStartHook';
import { IDiConfigLoaderService } from './utils/loader/IDiConfigLoaderService';

export interface RafterConfig {
  diConfigLoaderService: IDiConfigLoaderService;
  logger?: ILogger;
}

export default class Rafter {
  private boxDiAutoLoader?: IDiAutoloader;

  private server?: IServer;

  private readonly diConfigLoaderService: IDiConfigLoaderService;

  private readonly logger: ILogger;

  constructor(rafterConfig: RafterConfig) {
    const { diConfigLoaderService, logger = console } = rafterConfig;

    this.diConfigLoaderService = diConfigLoaderService;
    this.logger = logger;
  }

  private async loadDependencies(): Promise<void> {
    const configDto = await this.diConfigLoaderService.getDiConfig();

    // this.logger.debug('rafter::loadDependencies', configDto);
    //
    // // add the config to the DI container
    // Box.register('config', (): object => configDto.getConfig());
    //
    // // add the services to the DI container
    // Box.register('services', (): IServiceConfig => configDto.getServices());
    //
    // // add the routes to the DI container
    // Box.register('routes', (): IRouteConfig[] => configDto.getRoutes());
    //
    // // add the middleware to the DI container
    // Box.register('middleware', (): IMiddlewareConfig[] => configDto.getMiddleware());
    //
    // // add the middleware to the DI container
    // Box.register('preStartHooks', (): IPreStartHookConfig[] => configDto.getPreStartHooks());

    this.boxDiAutoLoader = diAutoloaderFactory(configDto.getServices(), containerFactory(), this.logger);

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
