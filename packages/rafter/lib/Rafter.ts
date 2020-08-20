import { IDiAutoloader, IMergableFileNames, IPath, IPaths } from '@rafterjs/di-autoloader';
import { GlobWithOptions } from 'awilix';
import { join } from 'path';
import consoleLoggerFactory, { ILogger } from '@rafterjs/logger-plugin';
import { IServer } from './common/server';
import { IRafter } from './IRafter';
import { IPluginProvider, IPluginsConfig } from './common/plugins';

export const EXTENSION_GLOB_SUFFIX = '.@(ts|js)';
export const IGNORE_GLOB_SUFFIX = '!(*.spec|*.test|index|*.d)';
export const GLOB_SUFFIX = `${IGNORE_GLOB_SUFFIX}${EXTENSION_GLOB_SUFFIX}`;
export const CORE_LIB_DIRECTORIES = ['common', 'utils', 'vendor'];
export const PLUGIN_FILENAME = 'plugins';
export const CONFIG_FILENAME = 'config';

export enum DEFAULT_MERGABLE_FILENAMES {
  CONFIG = 'config',
  MIDDLEWARE = 'middleware',
  ROUTES = 'routes',
  PRE_START_HOOKS = 'preStartHooks',
  PLUGINS = 'plugins',
}

export const DEFAULT_MERGABLE_FILENAME_VALUES = Object.values(DEFAULT_MERGABLE_FILENAMES);

export const CORE_PATH = join(__dirname, `/@(${CORE_LIB_DIRECTORIES.join('|')})/**/`);

export interface RafterConfig {
  diAutoloader: IDiAutoloader;
  corePath?: GlobWithOptions | string;
  paths?: Array<string | GlobWithOptions>;
  mergableFileNames?: IMergableFileNames;
  pluginProvider: IPluginProvider;
  logger?: ILogger;
}

export default class Rafter implements IRafter {
  private readonly diAutoloader: IDiAutoloader;

  private readonly pluginProvider: IPluginProvider;

  private server?: IServer;

  private readonly corePath: GlobWithOptions | string;

  private readonly mergableFileNames: IMergableFileNames = DEFAULT_MERGABLE_FILENAME_VALUES;

  private readonly paths: Array<string | GlobWithOptions>;

  private readonly logger: ILogger;

  constructor(rafterConfig: RafterConfig) {
    const {
      corePath = CORE_PATH,
      paths = [],
      mergableFileNames = DEFAULT_MERGABLE_FILENAME_VALUES,
      diAutoloader,
      pluginProvider,
      logger = consoleLoggerFactory(),
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
    this.diAutoloader.registerValue('logger', this.logger);

    const appPaths = [this.corePath, ...this.paths];
    const allPathsWithSuffix = this.getPathsWithSuffix(appPaths);
    const pluginPaths = await this.getPluginPaths(allPathsWithSuffix);
    const pluginPathsWithSuffix = this.getPathsWithSuffix(pluginPaths);

    // TODO clean up the plugins. It's too tightly coupled atm.
    await this.loadPlugins(pluginPathsWithSuffix);
    const allPaths = [...pluginPathsWithSuffix, ...allPathsWithSuffix];
    this.logger.info(`Loading dependencies from: `, allPaths);
    await this.diAutoloader.load(allPaths, this.mergableFileNames);
  }

  private async initServer(): Promise<void> {
    this.server = this.diAutoloader.get<IServer>('server');
    await this.server.start();
  }

  public async start(): Promise<void> {
    try {
      if (this.diAutoloader) {
        await this.initDependencies();
        await this.initServer();
      } else {
        throw new Error(`Rafter::start You must define a DiAutoloader`);
      }
    } catch (error) {
      this.logger.error(`Rafter::start`, error);
      throw error;
    }
  }

  public async stop(): Promise<void> {
    if (this.server) {
      return this.server.stop();
    }

    throw new Error('Rafter::stop the server has not been started');
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

      if (plugins.length > 0) {
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

  private async loadPlugins(paths: IPaths = []): Promise<void> {
    if (paths.length > 0) {
      await this.loadPluginConfigFiles(paths);

      this.logger.debug(`   Getting plugin configs`);
      const plugins = await this.diAutoloader.get<IPluginsConfig>(PLUGIN_FILENAME);
      await this.pluginProvider.createInstance(plugins);
    }
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
