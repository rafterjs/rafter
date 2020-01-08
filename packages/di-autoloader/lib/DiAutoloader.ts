import { asClass, asFunction, asValue, AwilixContainer } from 'awilix';
import { FunctionReturning } from 'awilix/lib/container';
import { Constructor } from 'awilix/lib/resolvers';
import { ILogger } from '../../core/lib/utils/logger/ILogger';
import { IDiAutoloader } from './IDiAutoloader';
import { IServiceConfig } from './IServiceConfig';

export type Class = {
  constructor: Function;
};

export type Service = Function | Class | object;

export default class DiAutoloader implements IDiAutoloader {
  private readonly serviceConfig: IServiceConfig;

  private readonly container: AwilixContainer;

  private readonly logger: ILogger;

  constructor(serviceConfig: IServiceConfig, container: AwilixContainer, logger: ILogger = console) {
    this.serviceConfig = serviceConfig;
    this.container = container;
    this.logger = logger;
  }

  /**
   * Loads all the services
   */
  public load(): void {
    Object.entries(this.serviceConfig).forEach(([name, { path, dependencies }]) => {
      try {
        this.logger.debug(`Auto loading ${name}`);
        // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require,import/no-dynamic-require
        let service = require(path);
        service = service.default || service;

        this.register(name, service, dependencies);
      } catch (error) {
        this.logger.error(`Failed to load ${name}`, error);
      }
    });
  }

  private register<T>(name: string, service: Service, dependencies: string[]): void {
    if (service instanceof Function) {
      // check for a class
      if (service.name && service.prototype) {
        this.container.register(name, asClass<T>(service as Constructor<T>));
      } else {
        // otherwise it is just a function, so ensure it loads in
        this.container.register(name, asFunction<T>(service as FunctionReturning<T>));
      }
    } else {
      // TODO fix this. I want to be able to access "config" using dot notation.
      // The problem is that at runtime we want to resolve it, but we need to define the alias at register time.
      // this is just a plain object/dependency that should be loaded
      this.container.register(
        name,
        asValue(service),
      );
    }
  }

  public get<T>(name: string): T {
    return this.container.resolve<T>(name);
  }
}
