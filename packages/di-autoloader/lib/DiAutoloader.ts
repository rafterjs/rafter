import { asClass, asFunction, asValue, Constructor, FunctionReturning, listModules } from 'awilix';
import { LoadModulesOptions } from 'awilix/lib/load-modules';
import { ILogger } from '@rafter/utils';
import { isClass } from 'is-class';
import { camelCase } from 'lodash';
import { GlobWithOptions, ListModulesOptions, ModuleDescriptor } from 'awilix/lib/list-modules';
import { IDiAutoloader } from './IDiAutoloader';
import { IDiContainer } from './IDiContainer';
import { IService } from './IService';

export class DiAutoloader implements IDiAutoloader {
  public readonly container: IDiContainer;

  private readonly logger: ILogger;

  constructor(container: IDiContainer, logger: ILogger = console) {
    this.container = container;
    this.logger = logger;
  }

  public load(
    paths: Array<string | GlobWithOptions> | string,
    options: LoadModulesOptions = { formatName: this.formatName },
  ): void {
    if (paths && paths.length > 0) {
      const modulePaths = paths instanceof Array ? paths : [paths];

      this.logger.debug(`Registering modules from ${modulePaths.join(' ')}`);
      this.container.loadModules(modulePaths, options);
    } else {
      throw new Error(`No paths were specified to load from`);
    }
  }

  public list(paths: string | Array<string | GlobWithOptions>, options?: ListModulesOptions): ModuleDescriptor[] {
    return listModules(paths, options);
  }

  public get<T>(name: string): T {
    this.logger.debug(`Resolving ${name}`);
    return this.container.resolve<T>(name);
  }

  public register<T>(name: string, service: IService<T>): void {
    this.logger.debug(`Registering ${name}`);
    if (service instanceof Function) {
      this.registerFunction(name, service as FunctionReturning<T>);
    } else if (isClass(service)) {
      this.registerClass(name, service as Constructor<T>);
    } else {
      this.registerValue(name, service);
    }
  }

  public registerClass<T>(name: string, service: Constructor<T>): void {
    this.logger.debug(`Registering ${name}`);
    this.container.register(name, asClass(service));
  }

  public registerFunction<T>(name: string, service: FunctionReturning<T>): void {
    this.logger.debug(`Registering ${name}`);
    this.container.register(name, asFunction(service));
  }

  public registerValue<T>(name: string, service: T): void {
    this.logger.debug(`Registering ${name}`);
    this.container.register(name, asValue(service));
  }

  private formatName(name: string): string {
    return camelCase(name);
  }
}
