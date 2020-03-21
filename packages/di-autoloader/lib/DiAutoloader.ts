import { listModules } from 'awilix';
import { LoadModulesOptions } from 'awilix/lib/load-modules';
import { ILogger } from '@rafter/utils';
import { GlobWithOptions, ListModulesOptions, ModuleDescriptor } from 'awilix/lib/list-modules';
import { IDiAutoloader } from './IDiAutoloader';
import { IDiContainer } from './IDiContainer';

export default class DiAutoloader implements IDiAutoloader {
  public readonly container: IDiContainer;

  private readonly logger: ILogger;

  constructor(container: IDiContainer, logger: ILogger = console) {
    this.container = container;
    this.logger = logger;
  }

  public load(
    paths: Array<string | GlobWithOptions> | string,
    options: LoadModulesOptions = { formatName: 'camelCase' },
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
}
