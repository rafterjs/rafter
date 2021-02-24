import { IDiAutoloader, IMergableFileNames, IPath, IPaths } from '@rafterjs/di-autoloader';
import { ILogger, loggerFactory } from '@rafterjs/logger-plugin';
import { GlobWithOptions } from 'awilix';
import { join } from 'path';
import { IRafter } from './IRafter';
import { IPluginProvider, IPluginsConfig } from './plugins';

export interface IRafterConfig {
  diAutoloader: IDiAutoloader;
  corePath: GlobWithOptions | string;
  paths?: Array<string | GlobWithOptions>;
  mergableFileNames?: IMergableFileNames;
  pluginProvider: IPluginProvider;
  logger?: ILogger;
}

export const PLUGIN_FILENAME = 'plugins';
export const EXTENSION_GLOB_SUFFIX = '.@(ts|js)';
export const IGNORE_GLOB_SUFFIX = '!(*.spec|*.test|index|*.d)';
export const GLOB_SUFFIX = `${IGNORE_GLOB_SUFFIX}${EXTENSION_GLOB_SUFFIX}`;

export class Rafter implements IRafter {
  private readonly diAutoloader: IDiAutoloader;

  private readonly pluginProvider: IPluginProvider;

  private readonly corePath: GlobWithOptions | string;

  private readonly mergableFileNames: IMergableFileNames;

  private readonly paths: Array<string | GlobWithOptions>;

  private readonly logger: ILogger;

  constructor(rafterConfig: IRafterConfig) {
    const {
      corePath,
      paths = [],
      mergableFileNames = [],
      diAutoloader,
      pluginProvider,
      logger = loggerFactory('rafter'),
    } = rafterConfig;

    this.corePath = corePath;
    this.mergableFileNames = mergableFileNames;
    this.paths = paths;
    this.logger = logger;
    this.pluginProvider = pluginProvider;
    this.diAutoloader = diAutoloader;
  }

  private async initDependencies(): Promise<void> {
    this.diAutoloader.registerValue('diAutoloader', this.diAutoloader);
    this.diAutoloader.registerValue('pluginProvider', this.pluginProvider);
    this.diAutoloader.registerValue('logger', this.logger);

    const appPaths = [this.corePath, ...this.paths];
    const allPathsWithSuffix = this.getPathsWithSuffix(appPaths);
    const pluginPaths = await this.getPluginPaths(allPathsWithSuffix);
    const pluginPathsWithSuffix = this.getPathsWithSuffix(pluginPaths);

    const allPaths = [...pluginPathsWithSuffix, ...allPathsWithSuffix];

    this.logger.info(`Loading dependencies from: `, allPaths);

    await this.diAutoloader.load(allPaths, this.mergableFileNames);
  }

  public async start(): Promise<void> {
    try {
      if (this.diAutoloader) {
        await this.initDependencies();
      } else {
        throw new Error(`Rafter::start You must define a DiAutoloader`);
      }
    } catch (error) {
      this.logger.error(`Rafter::start`, error);
      throw error;
    }
  }

  public async stop(): Promise<void> {
    return this.diAutoloader.unregister();
  }

  public async get<T>(serviceName: string): Promise<T> {
    return this.diAutoloader.get<T>(serviceName);
  }

  private getPathsWithSuffix(paths: IPaths = []): IPaths {
    return paths.map((path) => join(path as string, GLOB_SUFFIX));
  }

  // TODO move this to another service
  private async getPluginPaths(paths: IPaths = []): Promise<IPaths> {
    const pluginPaths: Set<IPath> = new Set<IPath>();

    if (paths.length > 0) {
      await this.loadPluginFiles(paths);
      this.logger.debug(`   Getting plugin configs`);
      const plugins = await this.diAutoloader.get<IPluginsConfig>(PLUGIN_FILENAME);

      if (plugins.size > 0) {
        this.logger.debug(`   Found plugin configs`, plugins);
        for (const plugin of plugins) {
          try {
            this.logger.debug(`    The plugin ${plugin.name} is located in ${plugin.path}`);
            pluginPaths.add(plugin.path);
          } catch (error) {
            this.logger.error(`The plugin ${plugin.name} could not be initialized`, error);
          }
        }
      }
    }

    this.logger.debug(`    The plugin paths are:`, pluginPaths);
    return Array.from(pluginPaths);
  }

  private async loadPluginFiles(paths: IPaths): Promise<void> {
    const dependencies = this.diAutoloader.list(paths);
    const pluginPaths = dependencies.filter(({ name }) => name === PLUGIN_FILENAME).map(({ path }) => path);

    return this.diAutoloader.loadMergableFiles(pluginPaths, [PLUGIN_FILENAME]);
  }

  private async loadPluginConfigFiles(paths: IPaths = []): Promise<void> {
    const dependencies = this.diAutoloader.list(paths);
    const pluginPaths = dependencies.filter(({ name }) => name === PLUGIN_FILENAME).map(({ path }) => path);
    if (pluginPaths.length > 0) {
      await this.diAutoloader.loadMergableFiles(pluginPaths, [PLUGIN_FILENAME]);
    }
  }
}

export default Rafter;
