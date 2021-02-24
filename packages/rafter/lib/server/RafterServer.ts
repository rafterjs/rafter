import { ILogger, loggerFactory } from '@rafterjs/logger-plugin';
import { join } from 'path';
import { IRafter } from '../IRafter';
import { IRafterServer } from './IRafterServer';
import { IServer } from './common/server';

export const SERVER_CORE_LIB_DIRECTORIES: string[] = ['common', 'utils', 'vendor'];

export const SERVER_DEFAULT_MERGABLE_FILENAMES = {
  CONFIG: 'config',
  MIDDLEWARE: 'middleware',
  ROUTES: 'routes',
  PRE_START_HOOKS: 'preStartHooks',
  PLUGINS: 'plugins',
};

export const SERVER_DEFAULT_MERGABLE_FILENAME_VALUES = Object.values(SERVER_DEFAULT_MERGABLE_FILENAMES);

export const SERVER_CORE_PATH = join(__dirname, `/@(${SERVER_CORE_LIB_DIRECTORIES.join('|')})/**/`);

export interface IRafterServerConfig {
  rafter: IRafter;
  logger?: ILogger;
}

export class RafterServer implements IRafterServer {
  private readonly rafter: IRafter;

  private server?: IServer;

  private readonly logger: ILogger;

  constructor(rafterConfig: IRafterServerConfig) {
    const { rafter, logger = loggerFactory('rafter server') } = rafterConfig;

    this.rafter = rafter;
    this.logger = logger;
  }

  private async initServer(): Promise<void> {
    this.server = await this.rafter.get<IServer>('server');
    if (this.server) {
      await this.server.start();
    } else {
      throw new Error(`Rafter::initServer There is no server within the dependencies`);
    }
  }

  public async start(): Promise<void> {
    try {
      await this.rafter.start();
      await this.initServer();
    } catch (error) {
      this.logger.error(`Rafter::start`, error);
      throw error;
    }
  }

  public async stop(): Promise<void> {
    await this.rafter.stop();
    if (this.server) {
      return this.server.stop();
    }

    throw new Error('Rafter::stop the server has not been started');
  }

  public async get<T>(serviceName: string): Promise<T> {
    return this.rafter.get<T>(serviceName);
  }
}
