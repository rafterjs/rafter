import { Box } from 'box-di';
import { ILogger } from './utils/ILogger';
import { IConfigAutoloader } from './utils/IConfigAutoloader';
import { IServer } from './common/server/Server';
import boxDiAutoloaderFactory, { IDiAutoloader } from './vendor/BoxDiAutoloaderFactory';

const RAFTER_AUTOLOADER_DIRECTORY = `${__dirname}/lib`;

interface IRafter {
  appDirectory?: string;
  configAutoloaderService?: IConfigAutoloader;
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
  boxDiAutoLoader: IDiAutoloader;
  server: IServer;
  appDirectory: string;
  configAutoloaderService: IConfigAutoloader;
  logger: ILogger;

  constructor({ appDirectory = `${__dirname}/../../`, configAutoloaderService, logger = console }: IRafter) {
    this.appDirectory = appDirectory;
    this.configAutoloaderService = configAutoloaderService;
    this.logger = logger;
  }

  /**
   * @return {Promise<ConfigDto>}
   * @private
   */
  async getConfig() {
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

  async getAutoloader(): Promise<IDiAutoloader> {
    const configDto = await this.getConfig();
    // TODO namespace these DI services

    // add the config to the DI container
    Box.register(`config`, () => configDto.getConfig());

    // add the services to the DI container
    Box.register(`services`, () => configDto.getServices());

    // add the routes to the DI container
    Box.register(`routes`, () => configDto.getRoutes());

    // add the middleware to the DI container
    Box.register(`middleware`, () => configDto.getMiddleware());

    // add the middleware to the DI container
    Box.register(`preStartHooks`, () => configDto.getPreStartHooks());

    return boxDiAutoloaderFactory(configDto.getServices(), this.logger);
  }

  async start() {
    try {
      this.boxDiAutoLoader = await this.getAutoloader();
      await this.boxDiAutoLoader.load();

      /**
       * @type {Server}
       */
      this.server = this.boxDiAutoLoader.get<IServer>('server');
      return this.server.start();
    } catch (error) {
      this.logger.error(error);
      return Promise.reject();
      // process.exit(1);
    }
  }

  /**
   * @return {Promise}
   */
  async stop() {
    if (this.server) {
      // TODO empty the service container
      // boxDiAutoLoader.reset();
      return this.server.stop();
    }

    throw new Error(`Rafter::stop the server has not been started`);
  }
}
