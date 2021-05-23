import { join } from 'path';
import { IRafterServer, IService, rafterServerFactory } from 'rafter';
import { ILogger, loggerFactory } from '@rafterjs/logger-plugin';

export interface IServerProps {
  paths?: string[];
  logger?: ILogger;
}

export class Server {
  private readonly server: IRafterServer;

  constructor({ paths = [], logger = loggerFactory('server') }: IServerProps) {
    const apiPaths = [join(__dirname, `/../{lib,config}/**/`)];

    this.server = rafterServerFactory({
      paths: [...apiPaths, ...paths],
      logger,
    });
  }

  public async start(): Promise<void> {
    return this.server.start();
  }

  public async stop(): Promise<void> {
    return this.server.stop();
  }

  public get<T>(serviceName: string): T {
    return this.server.get<T>(serviceName);
  }

  public register<T>(name: string, service: IService<T>): void {
    this.server.register<T>(name, service);
  }
}
