import {IDiContainer, ILogger} from '@rafter/di-container';

declare namespace b {
  interface IDiAutoloader {
    load(): void;

    get<T>(serviceName: string): T;
  }

  interface IServiceConfig {
    [name: string]: {
      path: string;
      dependencies: string[];
    };
  }

  class BoxDiAutoLoader implements IDiAutoloader {
    constructor(services: IServiceConfig, box: IDiContainer, logger: ILogger);

    load(): void;

    get<T>(serviceName: string): T;
  }
}

export = b;
