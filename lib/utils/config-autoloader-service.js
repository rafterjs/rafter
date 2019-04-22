import fs from 'fs';
import { promisify } from 'util';
import ConfigDto from './config-dto';

const readDirectory = promisify(fs.readdir);
const stats = promisify(fs.stat);
const DEFAULT_FILENAMES = {
  CONFIG: `.config.js`,
  SERVICES: `.services.js`,
  MIDDLEWARE: `.middleware.js`,
  ROUTES: `.routes.js`,
  PRE_START_HOOKS: `.pre-start-hooks.js`,
};
const IGNORE_DIRECTORIES = [`node_modules`, `.git`];

/**
 * A service that autoloads all the config from dotfiles in the project
 *
 * @param {string=} configFileName
 * @param {string=} servicesFileName
 * @param {string=} middlewareFileName
 * @param {string=} routesFileName
 * @param {string=} preStartHooksFileName
 * @param {Logger=} logger
 *
 * @return {ConfigAutoloaderService}
 */
export default ({
  configFileName = DEFAULT_FILENAMES.CONFIG,
  servicesFileName = DEFAULT_FILENAMES.SERVICES,
  middlewareFileName = DEFAULT_FILENAMES.MIDDLEWARE,
  routesFileName = DEFAULT_FILENAMES.ROUTES,
  preStartHooksFileName = DEFAULT_FILENAMES.PRE_START_HOOKS,
  logger = console,
}) => {
  /**
   * @namespace ConfigAutoloaderService
   */
  const ConfigAutoloaderService = {};
  const allowedFileNames = [
    configFileName,
    servicesFileName,
    middlewareFileName,
    routesFileName,
    preStartHooksFileName,
  ];

  /**
   * @param {string} pathname
   * @return {boolean}
   * @private
   */
  function isIgnoredDirectory(pathname) {
    const directories = pathname.split('/');
    const lastDirectory = directories.pop();
    return IGNORE_DIRECTORIES.includes(lastDirectory);
  }

  /**
   * @param {ConfigDto} configDto
   * @param {object} config
   * @param {string} fileName
   * @private
   */
  function updateConfig(configDto, config, fileName) {
    switch (fileName) {
      case configFileName:
        configDto.addConfig(config);
        break;
      case servicesFileName:
        configDto.addServices(config);
        break;
      case middlewareFileName:
        configDto.addMiddleware(config);
        break;
      case routesFileName:
        configDto.addRoutes(config);
        break;
      case preStartHooksFileName:
        configDto.addPreStartHooks(config);
        break;
      default:
        break;
    }
  }

  /**
   * @param {string} filePath
   * @return {Promise<boolean>}
   * @private
   */
  async function isDirectory(filePath) {
    const fileStats = await stats(filePath);
    return fileStats.isDirectory();
  }

  /**
   * @param {string} directory
   * @return {Promise<ConfigDto>}
   */
  ConfigAutoloaderService.get = async directory => {
    const configDto = ConfigDto();

    const files = await readDirectory(directory);

    Object.values(files).forEach(async fileName => {
      const pathname = `${directory}/${fileName}`;
      logger.debug(`RecursiveConfigLoader::get checking path ${pathname}`);

      if (allowedFileNames.includes(fileName)) {
        try {
          // eslint-disable-next-line
          const fileConfig = require(pathname);

          updateConfig(configDto, fileConfig.default || fileConfig, fileName);
        } catch (error) {
          logger.error(`RecursiveConfigLoader::get Failed to load ${pathname}`, error);
        }
      } else if ((await isDirectory(pathname)) && !isIgnoredDirectory(pathname)) {
        const foundConfigDto = await ConfigAutoloaderService.get(pathname);

        // append the config to the current one
        configDto
          .addConfig(foundConfigDto.getConfig())
          .addMiddleware(foundConfigDto.getMiddleware())
          .addServices(foundConfigDto.getServices())
          .addPreStartHooks(foundConfigDto.getPreStartHooks())
          .addRoutes(foundConfigDto.getRoutes());
      }
    });

    return configDto;
  };

  return Object.freeze(ConfigAutoloaderService);
};
