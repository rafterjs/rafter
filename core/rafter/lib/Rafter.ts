import { IDiAutoloader, IMergableFileNames, IPath, IPaths, IService } from '@rafterjs/di-autoloader';
import { ILogger, loggerFactory } from '@rafterjs/logger-plugin';
import { GlobWithOptions } from 'awilix';
import { dirname, join } from 'path';
import { IRafter } from './IRafter';
import { IPluginPathProvider, IPlugins } from './plugins';

export interface IRafterConfig {
  diAutoloader: IDiAutoloader;
  corePath: GlobWithOptions | string;
  paths?: Array<string | GlobWithOptions>;
  mergableFileNames?: IMergableFileNames;
  pluginPathProvider: IPluginPathProvider;
  logger?: ILogger;
}

export const PLUGIN_FILENAME = 'plugins';
export const EXTENSION_GLOB_SUFFIX = '.@(ts|js)';
export const IGNORE_GLOB_SUFFIX = '!(*.spec|*.test|index|*.d)';
export const GLOB_SUFFIX = `${IGNORE_GLOB_SUFFIX}${EXTENSION_GLOB_SUFFIX}`;

export class Rafter implements IRafter {
  private readonly diAutoloader: IDiAutoloader;

  private readonly pluginPathProvider: IPluginPathProvider;

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
      pluginPathProvider,
      logger = loggerFactory('rafter'),
    } = rafterConfig;

    this.corePath = corePath;
    this.mergableFileNames = mergableFileNames;
    this.paths = paths;
    this.logger = logger;
    this.pluginPathProvider = pluginPathProvider;
    this.diAutoloader = diAutoloader;
  }

  private async initDependencies(): Promise<void> {
    this.diAutoloader.registerValue('diAutoloader', this.diAutoloader);
    this.diAutoloader.registerValue('logger', this.logger);

    const corePathsWithSuffix = this.getPathsWithSuffix([this.corePath]);
    const appPathsWithSuffix = this.getPathsWithSuffix(this.paths);
    const pluginPaths = await this.getPluginPaths([...corePathsWithSuffix, ...appPathsWithSuffix]);
    const pluginPathsWithSuffix = this.getPathsWithSuffix(pluginPaths);

    const allPaths = [...corePathsWithSuffix, ...pluginPathsWithSuffix, ...appPathsWithSuffix];

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

  public get<T>(serviceName: string): T {
    return this.diAutoloader.get<T>(serviceName);
  }

  public register<T>(name: string, service: IService<T>): void {
    this.diAutoloader.register<T>(name, service);
  }

  private getPathsWithSuffix(paths: IPaths = []): IPaths {
    return paths.map((path) => join(path as string, GLOB_SUFFIX));
  }

  private async getPluginPaths(paths: IPaths = []): Promise<IPaths> {
    const pluginPaths: Set<IPath> = new Set<IPath>();

    if (paths.length > 0) {
      await this.loadPluginConfigs(paths);
      this.logger.debug(`   Getting plugin configs`);
      const plugins = await this.diAutoloader.get<IPlugins>(PLUGIN_FILENAME);

      if (plugins.size > 0) {
        this.logger.debug(`   Found plugin configs`, plugins);
        for (const plugin of plugins) {
          try {
            const path = await this.pluginPathProvider.getPath(plugin);
            console.log('----------------', path, dirname(`${path}`));
            this.logger.debug(`    The plugin ${plugin} is located in ${path}`);
            pluginPaths.add(path);
          } catch (error) {
            this.logger.error(`The plugin ${plugin} could not be initialized`, error);
          }
        }
      }
    }

    this.logger.debug(`    The plugin paths are:`, pluginPaths);
    return Array.from(pluginPaths);
  }

  private async loadPluginConfigs(paths: IPaths): Promise<void> {
    const dependencies = this.diAutoloader.list(paths);
    const pluginPaths = dependencies.filter(({ name }) => name === PLUGIN_FILENAME).map(({ path }) => path);

    return this.diAutoloader.loadMergableFiles(pluginPaths, [PLUGIN_FILENAME]);
  }
}

export default Rafter;
