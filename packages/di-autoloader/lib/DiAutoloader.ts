import { Box, IDiContainer } from '@rafter/di-container';
import { ILogger } from '../../core/lib/utils/logger/ILogger';
import { IDiAutoloader } from './IDiAutoloader';
import { IServiceConfig } from './IServiceConfig';

export default class DiAutoloader implements IDiAutoloader {
  private readonly serviceConfig: IServiceConfig;

  private readonly box: IDiContainer;

  private readonly logger: ILogger;

  constructor(serviceConfig: IServiceConfig, box: IDiContainer = Box, logger: ILogger = console) {
    this.serviceConfig = serviceConfig;
    this.box = box;
    this.logger = logger;
    this.box.setLogger(logger);
  }

  /**
   * Loads all the services
   */
  public load(): void {
    Object.entries(this.serviceConfig).forEach(([name, config]) => {
      try {
        this.logger.debug(`Auto loading ${name}`);
        // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require,import/no-dynamic-require
        let service = require(config.path);
        service = service.default || service;

        if (service instanceof Function) {
          // check for a class
          if (service.name && service.prototype) {
            this.box.registerInvokable(name, service, config.dependencies);
          } else {
            // otherwise it is just a function, so ensure it loads in
            this.box.register(name, service, config.dependencies);
          }
        } else {
          // this is just a plain object/dependency that should be loaded
          this.box.register(name, () => service, config.dependencies);
        }
      } catch (error) {
        this.logger.error(`Failed to load ${name}`, error);
      }
    });
  }

  public get<T>(name: string): T {
    return this.box.get<T>(name);
  }
}
