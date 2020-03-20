import { IDiAutoloader } from '@rafter/di-autoloader';
import { GlobWithOptions } from 'awilix';
import { ILogger } from './utils/logger/ILogger';
import { IServer } from './common/server/Server';
import diAutoloaderFactory from './vendor/DiAutoloaderFactory';
import containerFactory from './vendor/ContainerFactory';

export interface RafterConfig {
  paths: Array<string | GlobWithOptions> | string;
  logger?: ILogger;
}

export default class Rafter {
  private autoloader?: IDiAutoloader;

  private server?: IServer;

  private readonly paths: Array<string | GlobWithOptions> | string;

  private readonly logger: ILogger;

  constructor(rafterConfig: RafterConfig) {
    const { paths, logger = console } = rafterConfig;

    this.paths = paths;
    this.logger = logger;
  }

  private async load(): Promise<void> {
    // const configDto = await this.diConfigLoaderService.getDiConfig();
    //
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

    this.autoloader = diAutoloaderFactory(containerFactory(), this.logger);
    await this.autoloader.load(this.paths);
  }

  public async start(): Promise<void> {
    await this.load();

    if (this.autoloader) {
      console.log(this.autoloader.list(this.paths));
      // this.server = this.autoloader.get<IServer>('server');
      //
      // await this.server.start();
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
