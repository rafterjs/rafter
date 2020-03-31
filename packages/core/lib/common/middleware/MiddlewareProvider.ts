import { IDiAutoloader } from '@rafter/di-autoloader';
import { ILogger } from '@rafter/utils';
import { IMiddleware, IMiddlewareConfig } from './IMiddleware';

export interface IMiddlewareProvider {
  createInstance(middlewareConfig: string[]): IMiddleware | IMiddleware[];
}

/**
 * @param {IDiAutoloader} diContainer
 * @param {ILogger} logger
 * @return {MiddlewareProvider}
 */
export default class MiddlewareProvider implements IMiddlewareProvider {
  private readonly diAutoloader: IDiAutoloader;

  private readonly logger: ILogger;

  constructor(diAutoloader: IDiAutoloader, logger: ILogger) {
    this.diAutoloader = diAutoloader;
    this.logger = logger;
  }

  /**
   * @param {string[]} middlewareConfig
   * @return {Function|Function[]}
   */
  public createInstance(middlewareConfig: IMiddlewareConfig[]): IMiddleware | IMiddleware[] {
    const middlewareCollection: IMiddleware | IMiddleware[] = [];

    Object.values(middlewareConfig).forEach((middlewareServiceName): void => {
      try {
        this.logger.info(`    Adding middleware: ${middlewareServiceName}`);
        const middleware = this.diAutoloader.get<IMiddleware>(middlewareServiceName);
        middlewareCollection.push(middleware);
      } catch (error) {
        this.logger.error(`    Could not add middleware: ${middlewareServiceName}`, error);
      }
    });

    return middlewareCollection;
  }
}
