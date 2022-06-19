import { ILogger } from '@rafterjs/logger-plugin';
import {
  asClass,
  asFunction,
  asValue,
  Constructor,
  FunctionReturning,
  GlobWithOptions,
  Lifetime,
  listModules,
  ListModulesOptions,
  ModuleDescriptor,
} from 'awilix';
import { LoadModulesOptions } from 'awilix/lib/load-modules';
import { isClass } from 'is-class';
import { camelCase } from 'lodash';
import merge from 'ts-deepmerge';
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
import { MergableFileSet } from './MergableFileSet';

export { Lifetime };

export class DiAutoloader implements IDiAutoloader {
  private mergableFiles: IMergableFiles = new Map();

  constructor(public readonly container: IDiContainer, public readonly logger: ILogger = console) {}

  public async load(
    paths: IPaths = [],
    mergableFilenames: IMergableFileNames = [],
    options: ILoadOptions = {
      formatName: this.formatName,
      resolverOptions: {
        lifetime: Lifetime.SINGLETON,
      },
    },
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
    return this.container.resolve<T>(name);
  }

  public async registerMergableFiles(specialFiles: IMergableFiles): Promise<void> {
    this.logger.debug(`   Loading ${specialFiles.size} mergable files`);
    for (const [name, value] of specialFiles.entries()) {
      this.logger.debug(`   Merging ${name}`);
      let normalizedValue = value;

      if (normalizedValue instanceof Function) {
        normalizedValue = await normalizedValue();
      }

      if (this.container.hasRegistration(name)) {
        this.logger.debug(`   Updating ${name}`);
        await this.updateMergedFile(name, normalizedValue);
      } else {
        this.logger.debug(`   Setting ${name}`);
        this.mergableFiles.set(name, normalizedValue);
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
    this.container.register(name, asClass(service).singleton());
  }

  public registerFunction<T>(name: string, service: FunctionReturning<T>): void {
    this.logger.debug(`Registering ${name} as a function`);
    this.container.register(name, asFunction(service).singleton());
  }

  public registerValue<T>(name: string, service: T): void {
    this.logger.debug(`Registering ${name} as a value`);
    this.container.register(name, asValue(service));
  }

  public async unregister(): Promise<void> {
    return this.container.dispose();
  }

  private formatName(name: string): string {
    return camelCase(name);
  }

  public async updateMergedFile<T extends IMergableFile>(name: string, service: T): Promise<void> {
    let specialFile: T = service;
    if (service instanceof Function) {
      // @ts-ignore
      specialFile = await service();
    }

    this.logger.debug(`Adding to special file ${name}`, specialFile);
    this.mergableFiles.set(name, this.mergeFiles(this.mergableFiles.get(name) || {}, specialFile));
  }

  private mergeFiles(specialFile1?: IMergableFile, specialFile2?: IMergableFile): IMergableFile {
    if (specialFile1 && specialFile2) {
      let mergedFile: IMergableFile;
      this.logger.debug(`Deep merging two files:`, specialFile2, specialFile1);
      if (
        (specialFile1 instanceof Array && specialFile2 instanceof Array) ||
        (specialFile1 instanceof Set && specialFile2 instanceof Set)
      ) {
        // adding the last items first ensures they are not overridden since this is a Set.
        mergedFile = new MergableFileSet([...specialFile2, ...specialFile1]);
      } else {
        // override the values of 1 from 2
        mergedFile = merge(specialFile1, specialFile2);
      }
      this.logger.debug(`Deep merged file:`, mergedFile);

      return mergedFile;
    }
    if (!specialFile1 && specialFile2) {
      return specialFile2;
    }
    if (specialFile1 && !specialFile2) {
      return specialFile1;
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
          specialFile = await specialFile();
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
    return this.registerMergableFiles(files);
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
