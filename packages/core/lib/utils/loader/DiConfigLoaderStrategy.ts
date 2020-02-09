import * as path from 'path';
import recursive from 'recursive-readdir';
import * as fs from 'fs';
import DiConfigDto from './DiConfigDto';
import { ILogger } from '../logger/ILogger';
import { IDiConfigLoaderStrategy } from './IDiConfigLoaderStrategy';
import { IConfig } from './IConfig';
import { IServiceConfig } from '../../common/IService';
import { IMiddlewareConfig } from '../../common/middleware/IMiddleware';
import { IRouteConfig } from '../../common/router/IRouteConfig';
import { IPreStartHookConfig } from '../../common/pre-start-hooks/IPreStartHook';
import { IPluginsConfig } from '../../common/plugins/IPlugin';
import { IDiConfigLoaderStrategyOptions } from './IDiConfigLoaderStrategyOptions';

export const DEFAULT_FILENAMES = {
  CONFIG: `.config`,
  SERVICES: `.services`,
  PLUGINS: `.plugins`,
  MIDDLEWARE: `.middleware`,
  ROUTES: `.routes`,
  PRE_START_HOOKS: `.pre-start-hooks`,
};
const IGNORE_DIRECTORIES = [`dist`, `node_modules`, `.git`];

/**
 * A service that autoloads DI config from the config dotfiles in the project
 */
export default class DiConfigLoaderStrategy implements IDiConfigLoaderStrategy {
  private readonly allowedFileNames: string[];

  private readonly pluginsFileName: string;

  private readonly configFileName: string;

  private readonly servicesFileName: string;

  private readonly middlewareFileName: string;

  private readonly routesFileName: string;

  private readonly preStartHooksFileName: string;

  private readonly logger: ILogger;

  private readonly failOnError: boolean;

  constructor(options?: IDiConfigLoaderStrategyOptions) {
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
    const directories = pathname.split(path.sep);
    const lastDirectory = directories.pop();

    return !!lastDirectory && IGNORE_DIRECTORIES.includes(lastDirectory);
  }

  public getConfigFromFile(file: string): IConfig {
    // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require,import/no-dynamic-require
    const fileContents = require(file);
    const config = fileContents.default || fileContents;

    const filename = path.parse(file).name;
    const configDto = new DiConfigDto();

    switch (filename) {
      case this.pluginsFileName:
        configDto.addPluginsConfig(config as IPluginsConfig);
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
    return this.allowedFileNames.includes(path.parse(file).name);
  }

  public async getConfigFromDirectory(directory: string): Promise<IConfig> {
    let configDto = new DiConfigDto();

    const isIgnored = (file: string, stats: fs.Stats): boolean => {
      return (
        (stats.isDirectory() && DiConfigLoaderStrategy.isIgnoredDirectory(file)) ||
        (!stats.isDirectory() && !this.isAllowedFile(file))
      );
    };

    // get config files
    const files = await recursive(directory, [isIgnored]);

    files.forEach((file: string): void => {
      try {
        // eslint-disable-next-line
        this.logger.debug(`RecursiveConfigLoader::get Loading from ${file}`);

        const fileConfig = this.getConfigFromFile(file);
        configDto = new DiConfigDto(configDto, fileConfig);
      } catch (error) {
        this.logger.error(`RecursiveConfigLoader::get Failed to load ${file}`, error);
      }
    });

    return configDto;
  }
}
