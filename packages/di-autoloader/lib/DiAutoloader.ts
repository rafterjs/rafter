import { asClass, asFunction, asValue, Constructor, FunctionReturning, Lifetime, listModules } from 'awilix';
import { LoadModulesOptions } from 'awilix/lib/load-modules';
import { ILogger } from '@rafterjs/logger-plugin';
import { isClass } from 'is-class';
import { camelCase } from 'lodash';
import merge from 'ts-deepmerge';
import { GlobWithOptions, ListModulesOptions, ModuleDescriptor } from 'awilix/lib/list-modules';
import {
  IDiAutoloader,
  ILoadOptions,
  IMergableFile,
  IMergableFileNames,
  IMergableFiles,
  IPaths,
} from './IDiAutoloader';
import { IDiContainer } from './IDiContainer';
import { IService } from './IService';

export class DiAutoloader implements IDiAutoloader {
  private mergableFiles: IMergableFiles = new Map();

  public readonly container: IDiContainer;

  private readonly logger: ILogger;

  constructor(container: IDiContainer, logger: ILogger = console) {
    this.container = container;
    this.logger = logger;
  }

  public async load(
    paths: IPaths = [],
    mergableFilenames: IMergableFileNames = [],
    options: ILoadOptions = { formatName: this.formatName, resolverOptions: { lifetime: Lifetime.SINGLETON } },
  ): Promise<void> {
    this.logger.debug(`   Registering mergable files`);
    await this.loadMergableFiles(paths, mergableFilenames);

    this.logger.debug(`   Registering non-mergable files`);
    await this.loadNonMergableFiles(paths, mergableFilenames, options);
  }

  public list(paths: string | Array<string | GlobWithOptions>, options?: ListModulesOptions): ModuleDescriptor[] {
    return listModules(paths, options);
  }

  public get<T>(name: string): T {
    this.logger.debug(`Resolving ${name}`);
    const value = this.container.resolve<T>(name);
    this.logger.debug(`Found value for ${name}`, value);
    return value;
  }

  public registerMergableFiles(specialFiles: IMergableFiles): void {
    this.logger.debug(`   Loading ${specialFiles.size} mergable files`);
    for (const [name, value] of specialFiles.entries()) {
      this.logger.debug(`   Merging ${name}`);
      if (this.container.has(name)) {
        this.updateMergedFile(name, value);
      } else {
        if (value instanceof Function) {
          this.mergableFiles.set(name, value());
        } else {
          this.mergableFiles.set(name, value);
        }

        this.registerFunction(name, () => this.mergableFiles.get(name));
      }
    }
  }

  public register<T>(name: string, service: IService<T>): void {
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

  public updateMergedFile<T extends IMergableFile>(name: string, service: T): void {
    let specialFile: T = service;
    if (service instanceof Function) {
      specialFile = service();
    }

    this.logger.debug(`Adding to special file ${name}`, specialFile);
    const mergedFile = this.mergeFiles(this.mergableFiles.get(name) || {}, specialFile);
    this.logger.debug(`Merged files ${name}`, mergedFile);
    this.mergableFiles.set(name, mergedFile);
  }

  private mergeFiles(source?: IMergableFile, target?: IMergableFile): IMergableFile {
    if (target && source) {
      return merge(target, source);
    }
    if (!target && source) {
      return source;
    }
    if (target && !source) {
      return target;
    }
    throw new Error('You must pass at least one special file with contents');
  }

  private async mergeFilesFromDependencies(paths: ModuleDescriptor[]): Promise<IMergableFiles> {
    const mergedSpecialFiles: IMergableFiles = new Map();

    if (paths && paths.length > 0) {
      this.logger.debug(`Merging files`);

      for (const { path, name } of paths) {
        let specialFile = await import(path);
        if (specialFile.default) {
          specialFile = specialFile.default;
        }

        if (specialFile instanceof Function) {
          specialFile = specialFile();
        }

        this.logger.debug(`Merging file ${name}`);
        mergedSpecialFiles.set(name, this.mergeFiles(mergedSpecialFiles.get(name), specialFile));
      }

      this.logger.debug(`Completed merging files`, mergedSpecialFiles.entries());
    }

    return mergedSpecialFiles;
  }

  public async loadNonMergableFiles(
    paths: IPaths,
    mergableFileNames: IMergableFileNames,
    options: LoadModulesOptions,
  ): Promise<void> {
    const dependencies = this.getNonMergablePaths(this.list(paths), mergableFileNames);
    const plainPaths = dependencies.map(({ path }) => path);
    this.logger.debug(`   Loading non-mergable files from:`, plainPaths);
    this.container.loadModules(plainPaths, options);
  }

  public async loadMergableFiles(paths: IPaths, mergableFileNames: IMergableFileNames): Promise<void> {
    const dependencies = this.getMergablePaths(this.list(paths), mergableFileNames);
    const files = await this.mergeFilesFromDependencies(dependencies);
    this.registerMergableFiles(files);
  }

  private getMergablePaths(
    dependencies: ModuleDescriptor[],
    mergableFileNames: IMergableFileNames = [],
  ): ModuleDescriptor[] {
    return dependencies.filter(({ name }) => mergableFileNames.includes(name));
  }

  private getNonMergablePaths(
    dependencies: ModuleDescriptor[],
    mergableFileNames: IMergableFileNames = [],
  ): ModuleDescriptor[] {
    return dependencies.filter(({ name }) => !mergableFileNames.includes(name));
  }
}
