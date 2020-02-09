import { asClass, asFunction, asValue, AwilixContainer, listModules } from 'awilix';
import { get } from 'lodash';
import { FunctionReturning } from 'awilix/lib/container';
import { Constructor } from 'awilix/lib/resolvers';
import { LoadModulesOptions } from 'awilix/lib/load-modules';
import { GlobWithOptions, ListModulesOptions, ModuleDescriptor } from 'awilix/lib/list-modules';
import { ILogger } from '../../core/lib/utils/logger/ILogger';
import { IDiAutoloader } from './IDiAutoloader';
import { IDiContainer } from './IDiContainer';

export type Class = {
  constructor: Function;
};

export type Service = Function | Class | object;

export default class DiAutoloader implements IDiAutoloader {
  public readonly container: AwilixContainer;

  private readonly logger: ILogger;

  constructor(container: IDiContainer, logger: ILogger = console) {
    this.container = container;
    this.logger = logger;
  }

  public loadModules(paths: Array<string | GlobWithOptions> = [], options?: LoadModulesOptions): void {
    this.container.loadModules(paths, options);
  }

  public listModules(paths: string | Array<string | GlobWithOptions>, opts?: ListModulesOptions): ModuleDescriptor[] {
    return listModules(paths, opts);
  }

  public registerModule(name: string, path: string): void {
    // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require,import/no-dynamic-require
    let service = require(path);
    service = service.default || service;
    this.register(name, service);
  }

  /**
   * Loads all the services
   */
  public load(): void {
    // Object.entries(this.serviceConfig).forEach(([name, { path, dependencies }]) => {
    //   try {
    //     this.logger.debug(`Auto loading ${name}`);
    //     // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require,import/no-dynamic-require
    //     let service = require(path);
    //     service = service.default || service;
    //
    //     this.register(name, service, dependencies);
    //   } catch (error) {
    //     this.logger.error(`Failed to load ${name}`, error);
    //   }
    // });
  }

  private register<T>(name: string, service: Service): void {
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
      this.container.register(name, asValue(service));
    }
  }

  public get<T>(name: string): T {
    let deepObjectProperty: string | undefined;

    if (name.includes('.')) {
      deepObjectProperty = name
        .split('.')
        .slice(1)
        .join('.');
      name = name.split('.')[0]; // eslint-disable-line
    }

    const instance = this.container.resolve<T>(name);

    // check to see if we have a dot notation request
    if (deepObjectProperty) {
      return get(instance, deepObjectProperty);
    }
    return instance;
  }
}
