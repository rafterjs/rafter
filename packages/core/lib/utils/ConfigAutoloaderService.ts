import * as path from 'path';
import recursive from 'recursive-readdir';
import * as fs from 'fs';
import ConfigDto from './ConfigDto';
import { ILogger } from './ILogger';
import { IConfigAutoloader } from './IConfigAutoloader';
import { IConfig } from './IConfig';
import { IServiceConfig } from '../common/IService';
import { IMiddlewareConfig } from '../common/middleware/IMiddleware';
import { IRouteConfig } from '../common/router/IRouteConfig';
import { IPreStartHookConfig } from '../common/pre-start-hooks/IPreStartHook';
import { IPlugin } from '../common/plugins/IPlugin';

export const DEFAULT_FILENAMES = {
  CONFIG: `.config`,
  SERVICES: `.services`,
  PLUGINS: `.plugins`,
  MIDDLEWARE: `.middleware`,
  ROUTES: `.routes`,
  PRE_START_HOOKS: `.pre-start-hooks`,
};
const IGNORE_DIRECTORIES = [`node_modules`, `.git`];

export interface IConfigAutoloaderServiceOptions {
  configFileName?: string;
  servicesFileName?: string;
  pluginsFileName?: string;
  middlewareFileName?: string;
  routesFileName?: string;
  preStartHooksFileName?: string;
  logger?: ILogger;
  failOnError?: boolean;
}

/**
 * A service that autoloads all the config from dotfiles in the project
 */
export default class ConfigAutoloaderService implements IConfigAutoloader {
  private readonly allowedFileNames: string[];

  private readonly pluginsFileName: string;

  private readonly configFileName: string;

  private readonly servicesFileName: string;

  private readonly middlewareFileName: string;

  private readonly routesFileName: string;

  private readonly preStartHooksFileName: string;

  private readonly logger: ILogger;

  private readonly failOnError: boolean;

  constructor(options?: IConfigAutoloaderServiceOptions) {
    const {
      configFileName = DEFAULT_FILENAMES.CONFIG,
      servicesFileName = DEFAULT_FILENAMES.SERVICES,
      pluginsFileName = DEFAULT_FILENAMES.PLUGINS,
      middlewareFileName = DEFAULT_FILENAMES.MIDDLEWARE,
      routesFileName = DEFAULT_FILENAMES.ROUTES,
      preStartHooksFileName = DEFAULT_FILENAMES.PRE_START_HOOKS,
      logger = console,
      failOnError = false,
    } = options || {};

    this.allowedFileNames = [
      configFileName,
      servicesFileName,
      pluginsFileName,
      middlewareFileName,
      routesFileName,
      preStartHooksFileName,
    ];

    this.configFileName = configFileName;
    this.servicesFileName = servicesFileName;
    this.pluginsFileName = pluginsFileName;
    this.middlewareFileName = middlewareFileName;
    this.routesFileName = routesFileName;
    this.preStartHooksFileName = preStartHooksFileName;
    this.logger = logger;
    this.failOnError = failOnError;
  }

  private static isIgnoredDirectory(pathname: string): boolean {
    const directories = pathname.split('/');
    const lastDirectory = directories.pop();
    return !!lastDirectory && IGNORE_DIRECTORIES.includes(lastDirectory);
  }

  public getConfigFromFile(file: string): ConfigDto {
    // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require,import/no-dynamic-require
    const fileContents = require(file);
    const config = fileContents.default || fileContents;

    const filename = path.parse(file).name;
    const configDto = new ConfigDto();

    switch (filename) {
      case this.pluginsFileName:
        configDto.addPlugins(config as IPlugin<IConfig>);
        break;
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

    return configDto;
  }

  private isAllowedFile(file: string): boolean {
    return this.allowedFileNames.includes(path.basename(file));
  }

  public async getConfigFromDirectory(directory: string): Promise<ConfigDto> {
    let configDto = new ConfigDto();

    const isIgnored = (file: string, stats: fs.Stats): boolean => {
      return ConfigAutoloaderService.isIgnoredDirectory(file) || (!stats.isDirectory() && !this.isAllowedFile(file));
    };

    // get config files
    const files = await recursive(directory, [isIgnored]);

    files.forEach((file: string): void => {
      try {
        // eslint-disable-next-line
        this.logger.debug(`RecursiveConfigLoader::get Loading from ${file}`);

        const fileConfig = this.getConfigFromFile(file);
        configDto = new ConfigDto(configDto, fileConfig);
      } catch (error) {
        this.logger.error(`RecursiveConfigLoader::get Failed to load ${file}`, error);
      }
    });

    return configDto;
  }
}
