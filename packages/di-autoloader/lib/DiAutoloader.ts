import { asClass, asFunction, asValue, Constructor, FunctionReturning, listModules } from 'awilix';
import { LoadModulesOptions } from 'awilix/lib/load-modules';
import { ILogger } from '@rafterjs/utils';
import { isClass } from 'is-class';
import { camelCase, get, merge } from 'lodash';
import { GlobWithOptions, ListModulesOptions, ModuleDescriptor } from 'awilix/lib/list-modules';
import { IDiAutoloader } from './IDiAutoloader';
import { IDiContainer } from './IDiContainer';
import { IService } from './IService';

export type IConfig = {};

export const PATH_GLOB_SUFFIX = '!(*.spec).@(ts|js)';
export const CONFIG_FILENAME = 'config';

export class DiAutoloader implements IDiAutoloader {
  private config?: IConfig;

  private configProxy: {};

  public readonly container: IDiContainer;

  private readonly logger: ILogger;

  constructor(container: IDiContainer, logger: ILogger = console) {
    this.container = container;
    this.logger = logger;

    // use a proxy for the config dependency so that it can be updated when more configs are added
    const handler = {
      get: (obj: object, prop: any) => {
        return get(this.config, prop);
      },
    };
    this.configProxy = new Proxy({}, handler);
  }

  public async load(
    paths: Array<string | GlobWithOptions> | string,
    options: LoadModulesOptions = { formatName: this.formatName },
  ): Promise<void> {
    if (paths && paths.length > 0) {
      const modulePaths = paths instanceof Array ? paths : [paths];
      const dependencies = this.list(paths, options);

      // split configs and other dependencies
      this.logger.debug(`Registering configs`);
      await this.loadConfigs(dependencies);

      this.logger.debug(`Registering modules from ${modulePaths.join(' ')}`);
      await this.loadModules(dependencies, options);
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

  public registerConfig(config: IConfig): void {
    if (this.container.has(CONFIG_FILENAME)) {
      this.updateConfig(config);
    } else {
      this.config = config;
      if (config instanceof Function) {
        this.config = config();
      }

      this.registerValue(CONFIG_FILENAME, this.configProxy);
    }
  }

  public register<T>(name: string, service: IService<T>): void {
    if (name === CONFIG_FILENAME) {
      throw new Error(`Please use registerConfig(config); when registering a service with the name config`);
    }

    if (service instanceof Function) {
      this.registerFunction(name, service as FunctionReturning<T>);
    } else if (isClass(service)) {
      this.registerClass(name, service as Constructor<T>);
    } else {
      this.registerValue(name, service);
    }
  }

  public registerClass<T>(name: string, service: Constructor<T>): void {
    this.logger.debug(`Registering ${name} as a class`);
    this.container.register(name, asClass(service));
  }

  public registerFunction<T>(name: string, service: FunctionReturning<T>): void {
    this.logger.debug(`Registering ${name} as a function`);
    this.container.register(name, asFunction(service));
  }

  public registerValue<T>(name: string, service: T): void {
    this.logger.debug(`Registering ${name} as a value`);
    this.container.register(name, asValue(service));
  }

  private formatName(name: string): string {
    return camelCase(name);
  }

  private updateConfig<T extends IConfig>(service: T): void {
    let config: T = service;
    if (service instanceof Function) {
      config = service();
    }

    this.logger.debug(`Adding to config`, config);
    this.config = this.mergeConfigs(this.config || {}, config);
  }

  private mergeConfigs(config1: IConfig, config2: IConfig): IConfig {
    return merge(config1, config2);
  }

  private async mergeConfigsFromPaths(paths: ModuleDescriptor[]): Promise<IConfig> {
    let mergedConfig = {};
    if (paths && paths.length > 0) {
      this.logger.debug(`Merging configs`);

      // eslint-disable-next-line no-restricted-syntax
      for (const { path } of paths) {
        // eslint-disable-next-line no-await-in-loop
        let config = await import(path);
        if (config.default) {
          config = config.default;
        }

        if (config instanceof Function) {
          config = config();
        }

        mergedConfig = this.mergeConfigs(mergedConfig, config);
      }
      this.logger.debug(`Completed merging configs`, this.config || {});
    }

    return mergedConfig;
  }

  private async loadModules(dependencies: ModuleDescriptor[], options: LoadModulesOptions): Promise<void> {
    const noConfigs = dependencies.filter(({ name }) => name !== CONFIG_FILENAME).map(({ path }) => path);
    this.container.loadModules(noConfigs, options);
  }

  private async loadConfigs(dependencies: ModuleDescriptor[]): Promise<void> {
    const configs = dependencies.filter(({ name }) => name === CONFIG_FILENAME);
    const mergedConfigs = await this.mergeConfigsFromPaths(configs);
    this.registerConfig(mergedConfigs);
  }
}
