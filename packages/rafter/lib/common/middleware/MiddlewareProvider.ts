import { IDiAutoloader } from '@rafterjs/di-autoloader';
import { ILogger } from '@rafterjs/utils';
import { IMiddleware, IMiddlewareConfig } from './IMiddleware';

export interface IMiddlewareProvider {
  createInstance(middlewareConfig: string[]): IMiddleware[];
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
   * @param {string[]} middleware
   * @return {Function|Function[]}
   */
  public createInstance(middleware: IMiddlewareConfig[]): IMiddleware[] {
    const middlewareCollection: IMiddleware[] = [];

    Object.values(middleware).forEach((middlewareServiceName): void => {
      try {
        this.logger.info(`    Adding middleware: ${middlewareServiceName}`);
        const middlewareFunction = this.diAutoloader.get<IMiddleware>(middlewareServiceName);
        middlewareCollection.push(middlewareFunction);
      } catch (error) {
        this.logger.error(`    Could not add middleware: ${middlewareServiceName}`, error);
      }
    });

    return middlewareCollection;
  }
}
