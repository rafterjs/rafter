import { IDiAutoloader, IMergableFileNames, IPath, IPaths } from '@rafterjs/di-autoloader';
import { GlobWithOptions } from 'awilix';
import { dirname, join } from 'path';
import { consoleLoggerFactory, ILogger } from '@rafterjs/utils';
import { IServer } from './common/server';
import { IRafter } from './IRafter';
import { IPluginsConfig } from './common/plugins';

export const EXTENSION_GLOB_SUFFIX = '.@(ts|js)';
export const IGNORE_GLOB_SUFFIX = '!(*.spec|*.test|index|*.d)';
export const GLOB_SUFFIX = `${IGNORE_GLOB_SUFFIX}${EXTENSION_GLOB_SUFFIX}`;
export const CORE_LIB_DIRECTORIES = ['common', 'utils', 'vendor'];
export const PLUGIN_FILENAME = 'plugins';

export enum DEFAULT_MERGABLE_FILENAMES {
  CONFIG = 'config',
  MIDDLEWARE = 'middleware',
  ROUTES = 'routes',
  PRE_START_HOOKS = 'preStartHooks',
}

export const DEFAULT_MERGABLE_FILENAME_VALUES = Object.values(DEFAULT_MERGABLE_FILENAMES);

export const CORE_PATH = join(__dirname, `/@(${CORE_LIB_DIRECTORIES.join('|')})/**/`);

export interface RafterConfig {
  diAutoloader: IDiAutoloader;
  corePath?: GlobWithOptions | string;
  paths?: Array<string | GlobWithOptions>;
  mergableFileNames?: IMergableFileNames;
  logger?: ILogger;
}

export default class Rafter implements IRafter {
  private readonly diAutoloader: IDiAutoloader;

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
      logger = consoleLoggerFactory(),
    } = rafterConfig;

    this.corePath = corePath;
    this.mergableFileNames = mergableFileNames;
    this.paths = paths;
    this.logger = logger;
    this.diAutoloader = diAutoloader;
  }

  private async initDependencies(): Promise<void> {
    this.diAutoloader.registerValue('diAutoloader', this.diAutoloader);
    this.diAutoloader.registerValue('logger', this.logger);

    const appPaths = [this.corePath, ...this.paths];
    const allPathsWithSuffix = this.getPathsWithSuffix(appPaths);
    // TODO inject plugin config
    const pluginPaths = await this.getPluginPaths(allPathsWithSuffix);
    const pluginPathsWithSuffix = this.getPathsWithSuffix(pluginPaths);
    const allPaths = [...pluginPathsWithSuffix, ...allPathsWithSuffix];

    this.logger.info(`Loading dependencies from: `, allPaths);

    await this.diAutoloader.load(allPaths, this.mergableFileNames);
  }

  private async initServer(): Promise<void> {
    this.server = this.diAutoloader.get<IServer>('server');
    if (this.server) {
      await this.server.start();
    } else {
      throw new Error(`Rafter::initServer There is no server within the dependencies`);
    }
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
      console.log(`Rafter::start`, error);
      throw error;
    }
  }

  /**
   * @return {Promise}
   */
  public async stop(): Promise<void> {
    if (this.server) {
      return this.server.stop();
    }

    throw new Error('Rafter::stop the server has not been started');
  }

  /**
   * @return {Promise}
   */
  public async get<T>(serviceName: string): Promise<T> {
    return this.diAutoloader.get<T>(serviceName);
  }

  private getPathsWithSuffix(paths: IPaths): IPaths {
    return paths.map((path) => join(path as string, GLOB_SUFFIX));
  }

  private async getPluginPaths(paths: IPaths): Promise<IPaths> {
    const pluginPaths: Set<IPath> = new Set<IPath>();

    await this.loadPluginConfigs(paths);
    this.logger.debug(`   Getting plugin configs`);
    const pluginConfigNames = await this.diAutoloader.get<IPluginsConfig>(PLUGIN_FILENAME);

    this.logger.debug(`   Found plugin configs`, pluginConfigNames);
    const pluginNames = Object.keys(pluginConfigNames);
    if (pluginNames.length > 0) {
      this.logger.debug(`    There are ${pluginNames.length} plugins defined`, pluginNames);
      for (const name of pluginNames) {
        try {
          const pluginMainPath = require.resolve(name);
          const pluginDirPath = dirname(pluginMainPath);
          this.logger.debug(`    The plugin ${name} is located in ${pluginDirPath}`);

          pluginPaths.add(pluginDirPath);
        } catch (error) {
          this.logger.error(`The plugin ${name} could not be initialized`, error);
        }
      }
    }

    this.logger.debug(`    The plugin paths are:`, pluginPaths);
    return [...pluginPaths];
  }

  private async loadPluginConfigs(paths: IPaths): Promise<void> {
    const dependencies = this.diAutoloader.list(paths);
    const pluginPaths = dependencies.filter(({ name }) => name === PLUGIN_FILENAME).map(({ path }) => path);

    return this.diAutoloader.loadMergableFiles(pluginPaths, [PLUGIN_FILENAME]);
  }
}
