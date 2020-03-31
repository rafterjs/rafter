import { GlobWithOptions, ListModulesOptions, ModuleDescriptor } from 'awilix/lib/list-modules';
import { LoadModulesOptions } from 'awilix/lib/load-modules';
import { Constructor, FunctionReturning } from 'awilix';
import { IService } from './IService';

export interface IDiAutoloader {
  load(paths: Array<string | GlobWithOptions> | string, options?: LoadModulesOptions): void;

  get<T>(name: string): T;

  list(paths: string | Array<string | GlobWithOptions>, options?: ListModulesOptions): ModuleDescriptor[];

  register<T>(name: string, service: IService<T>): void;

  registerClass<T>(name: string, service: Constructor<T>): void;

  registerFunction<T>(name: string, service: FunctionReturning<T>): void;

  registerValue<T>(name: string, service: T): void;
}
