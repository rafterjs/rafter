import { GlobWithOptions, ListModulesOptions, ModuleDescriptor } from 'awilix/lib/list-modules';
import { LoadModulesOptions } from 'awilix/lib/load-modules';

export interface IDiAutoloader {
  load(paths: Array<string | GlobWithOptions> | string, options?: LoadModulesOptions): void;

  get<T>(name: string): T;

  list(paths: string | Array<string | GlobWithOptions>, options?: ListModulesOptions): ModuleDescriptor[];
}
