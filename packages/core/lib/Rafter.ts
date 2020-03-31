import { IDiAutoloader } from '@rafter/di-autoloader';
import { GlobWithOptions } from 'awilix';
import { join } from 'path';
import { consoleLoggerFactory, ILogger } from '@rafter/utils';
import { IServer } from './common/server';
import { IRafter } from './IRafter';

export const CORE_LIB_DIRECTORIES = ['common', 'utils', 'vendor'];

export const CORE_PATH = join(__dirname, `/@(${CORE_LIB_DIRECTORIES.join('|')})/`, '/**/!(*.spec|*.d).@(ts|js)');

export interface RafterConfig {
  diAutoloader: IDiAutoloader;
  corePath?: GlobWithOptions | string;
  paths?: Array<string | GlobWithOptions>;
  logger?: ILogger;
}

export default class Rafter implements IRafter {
  private readonly diAutoloader: IDiAutoloader;

  private server?: IServer;

  private readonly corePath: GlobWithOptions | string;

  private readonly paths: Array<string | GlobWithOptions>;

  private readonly logger: ILogger;

  constructor(rafterConfig: RafterConfig) {
    const { corePath = CORE_PATH, paths = [], diAutoloader, logger = consoleLoggerFactory() } = rafterConfig;

    this.corePath = corePath;
    this.paths = paths;
    this.logger = logger;
    this.diAutoloader = diAutoloader;
  }

  private async initDependencies(): Promise<void> {
    this.diAutoloader.registerValue('diAutoloader', this.diAutoloader);
    this.diAutoloader.registerValue('logger', this.logger);

    const allPaths = [this.corePath, ...this.paths];
    this.logger.debug(`Loading dependencies from: `, allPaths);

    await this.diAutoloader.load(allPaths);
    this.logger.debug(`Loaded the following dependencies: `, this.diAutoloader.list(allPaths));
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
    if (this.diAutoloader) {
      await this.initDependencies();
      await this.initServer();
    } else {
      throw new Error(`Rafter::start You must define a DiAutoloader`);
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
}
