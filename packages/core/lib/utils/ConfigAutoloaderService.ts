import * as path from 'path';
import recursive from 'recursive-readdir';
import * as fs from 'fs';
import ConfigDto from './ConfigDto';
import { ILogger } from './ILogger';
import { IConfigAutoloader } from './IConfigAutoloader';
import { IConfigTypes } from './IConfig';
import { IServiceConfig } from '../common/IService';
import { IMiddlewareConfig } from '../common/middleware/IMiddleware';
import { IRouteConfig } from '../common/router/IRouteConfig';
import { IPreStartHookConfig } from '../common/pre-start-hooks/IPreStartHook';

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
 */
export default class ConfigAutoloaderService implements IConfigAutoloader {
  private readonly allowedFileNames: string[];

  private readonly configFileName: string;

  private readonly servicesFileName: string;

  private readonly middlewareFileName: string;

  private readonly routesFileName: string;

  private readonly preStartHooksFileName: string;

  private readonly logger: ILogger;

  constructor({
    configFileName = DEFAULT_FILENAMES.CONFIG,
    servicesFileName = DEFAULT_FILENAMES.SERVICES,
    middlewareFileName = DEFAULT_FILENAMES.MIDDLEWARE,
    routesFileName = DEFAULT_FILENAMES.ROUTES,
    preStartHooksFileName = DEFAULT_FILENAMES.PRE_START_HOOKS,
    logger = console,
  }) {
    this.allowedFileNames = [
      configFileName,
      servicesFileName,
      middlewareFileName,
      routesFileName,
      preStartHooksFileName,
    ];
    this.configFileName = configFileName;
    this.servicesFileName = servicesFileName;
    this.middlewareFileName = middlewareFileName;
    this.routesFileName = routesFileName;
    this.preStartHooksFileName = preStartHooksFileName;
    this.logger = logger;
  }

  private static isIgnoredDirectory(pathname: string): boolean {
    const directories = pathname.split('/');
    const lastDirectory = directories.pop();
    return !!lastDirectory && IGNORE_DIRECTORIES.includes(lastDirectory);
  }

  private updateConfig(configDto: ConfigDto, config: IConfigTypes, file: string): void {
    const filename = path.basename(file);

    switch (filename) {
      case this.configFileName:
        configDto.addConfig(config as object);
        break;
      case this.servicesFileName:
        configDto.addServices(config as IServiceConfig);
        break;
      case this.middlewareFileName:
        configDto.addMiddleware(config as IMiddlewareConfig[]);
        break;
      case this.routesFileName:
        configDto.addRoutes(config as IRouteConfig[]);
        break;
      case this.preStartHooksFileName:
        configDto.addPreStartHooks(config as IPreStartHookConfig[]);
        break;
      default:
        break;
    }
  }

  private isAllowedFile(file: string): boolean {
    return this.allowedFileNames.includes(path.basename(file));
  }

  public async get(directory: string): Promise<ConfigDto> {
    const configDto = new ConfigDto();

    const isIgnored = (file: string, stats: fs.Stats): boolean => {
      return ConfigAutoloaderService.isIgnoredDirectory(file) || (!stats.isDirectory() && !this.isAllowedFile(file));
    };

    // get config files
    const files = await recursive(directory, [isIgnored]);

    files.forEach((file: string): void => {
      try {
        // eslint-disable-next-line
        const fileConfig = require(file);
        this.logger.debug(`RecursiveConfigLoader::get Loading from ${file}`);

        // TODO dont mutate, instead create a new one and merge
        this.updateConfig(configDto, fileConfig.default || fileConfig, file);
      } catch (error) {
        this.logger.error(`RecursiveConfigLoader::get Failed to load ${file}`, error);
      }
    });
    return configDto;
  }
}
