import { ILogger, loggerFactory } from '@rafterjs/logger-plugin';
import { join } from 'path';
import { IRafter } from '../IRafter';
import { IRafterServerless } from './IRafterServerless';

export const SERVERLESS_CORE_LIB_DIRECTORIES: string[] = [];

export const SERVERLESS_DEFAULT_MERGABLE_FILENAMES = {
  CONFIG: 'config',
  PLUGINS: 'plugins',
};

export const SERVERLESS_DEFAULT_MERGABLE_FILENAME_VALUES = Object.values(SERVERLESS_DEFAULT_MERGABLE_FILENAMES);

export const SERVERLESS_CORE_PATH = join(__dirname, `/@(${SERVERLESS_CORE_LIB_DIRECTORIES.join('|')})/**/`);

export interface IRafterServerlessConfig {
  rafter: IRafter;
  logger?: ILogger;
}

export class RafterServerless implements IRafterServerless {
  private readonly rafter: IRafter;

  private readonly logger: ILogger;

  constructor(rafterConfig: IRafterServerlessConfig) {
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
