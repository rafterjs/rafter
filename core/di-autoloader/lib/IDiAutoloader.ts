import { GlobWithOptions, ModuleDescriptor } from 'awilix/lib/list-modules';
import { LoadModulesOptions } from 'awilix/lib/load-modules';
import { Constructor, FunctionReturning } from 'awilix';
import { IService } from './IService';

export type IMergableFileFunction = () => Record<string, unknown> | Array<unknown>;
export type IMergableFile = Record<string, unknown> | Array<unknown> | Set<unknown> | IMergableFileFunction;
export type IMergableFiles = Map<string, IMergableFile>;
export type IMergableFileNames = string[];
export type IPath = string | GlobWithOptions;
export type IPaths = Array<IPath>;
export type ILoadOptions = LoadModulesOptions;
export type IConfig = IMergableFile;

export interface IDiAutoloader {
  load(paths: IPaths, mergableFilenames: IMergableFileNames, options?: ILoadOptions): Promise<void>;

  loadMergableFiles(paths: IPaths, mergableFilenames: IMergableFileNames): Promise<void>;

  loadNonMergableFiles(
    paths: IPaths,
    mergableFilenames: IMergableFileNames,
    options: LoadModulesOptions,
  ): Promise<void>;

  updateMergedFile<T extends IMergableFile>(name: string, service: T): void;

  registerMergableFiles(specialFiles: IMergableFiles): void;

  get<T>(name: string): T;

  list(paths: IPaths): ModuleDescriptor[];

  unregister(): Promise<void>;

  register<T>(name: string, service: IService<T>): void;

  registerClass<T>(name: string, service: Constructor<T>): void;

  registerFunction<T>(name: string, service: FunctionReturning<T>): void;

  registerValue<T>(name: string, service: T): void;
}
