import { IDiAutoloader } from '@rafterjs/di-autoloader';
import { ILogger } from '@rafterjs/logger-plugin';
import { IMiddleware, IMiddlewareConfig } from './IMiddleware';

export interface IMiddlewareProvider {
  createInstance(middlewareConfig: string[]): IMiddleware[];
}

export default class MiddlewareProvider implements IMiddlewareProvider {
  constructor(private readonly diAutoloader: IDiAutoloader, private readonly logger: ILogger) {}

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
