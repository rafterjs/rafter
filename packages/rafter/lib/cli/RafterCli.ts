import { ILogger, loggerFactory } from '@rafterjs/logger-plugin';
import { join } from 'path';
import { IRafter } from '../IRafter';
import { IRafterCli } from './IRafterCli';

export const CLI_CORE_LIB_DIRECTORIES: string[] = [];

export const CLI_DEFAULT_MERGABLE_FILENAMES = {
  CONFIG: 'config',
  PLUGINS: 'plugins',
};

export const CLI_DEFAULT_MERGABLE_FILENAME_VALUES = Object.values(CLI_DEFAULT_MERGABLE_FILENAMES);

export const CLI_CORE_PATH = join(__dirname, `/@(${CLI_CORE_LIB_DIRECTORIES.join('|')})/**/`);

export interface IRafterCliConfig {
  rafter: IRafter;
  logger?: ILogger;
}

export class RafterCli implements IRafterCli {
  private readonly rafter: IRafter;

  private readonly logger: ILogger;

  constructor(rafterConfig: IRafterCliConfig) {
    const { rafter, logger = loggerFactory() } = rafterConfig;

    this.rafter = rafter;
    this.logger = logger;
  }

  public async start(): Promise<void> {
    try {
      await this.rafter.start();
    } catch (error) {
      this.logger.error(`Rafter::start`, error);
      throw error;
    }
  }

  public async stop(): Promise<void> {
    await this.rafter.stop();
  }

  public async get<T>(serviceName: string): Promise<T> {
    return this.rafter.get<T>(serviceName);
  }
}
