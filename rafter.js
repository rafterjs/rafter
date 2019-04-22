import BoxDiAutoLoader from 'box-di-autoloader';
import { Box } from 'box-di';

const RAFTER_AUTOLOADER_DIRECTORY = `${__dirname}/lib`;

/**
 *
 * @param {string=} appDirectory This is the directory your application is located. Most of the time it
 *     will be 2 directories up from where Rafter is located, but that is not always the case.
 * @param {ConfigAutoloaderService} autoloaderService
 * @param {Logger=} logger a logging interface eg. winston, console, etc
 * @return {Rafter}
 */
export default ({ appDirectory = `${__dirname}/../../`, autoloaderService, logger = console }) => {
  /**
   * @namespace Rafter
   */
  const Rafter = {};

  let boxDiAutoLoader;
  let server;

  /**
   * @return {Promise<ConfigDto>}
   * @private
   */
  async function getConfig() {
    // load rafter config files first
    const configDto = await autoloaderService.get(RAFTER_AUTOLOADER_DIRECTORY);

    // load application specific config
    if (appDirectory) {
      const applicationConfigDto = await autoloaderService.get(appDirectory);

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

  async function getAutoloader() {
    const configDto = await getConfig();
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

    return new BoxDiAutoLoader(configDto.getServices(), Box, logger);
  }

  Rafter.start = async () => {
    try {
      boxDiAutoLoader = await getAutoloader();
      await boxDiAutoLoader.load();

      /**
       * @type {Server}
       */
      server = boxDiAutoLoader.get('server');
      return server.start();
    } catch (error) {
      logger.error(error);
      return Promise.reject();
      // process.exit(1);
    }
  };

  /**
   * @return {Promise}
   */
  Rafter.stop = async () => {
    if (server) {
      // TODO empty the service container
      // boxDiAutoLoader.reset();
      return server.stop();
    }

    throw new Error(`Rafter::stop the server has not been started`);
  };

  return Object.freeze(Rafter);
};
