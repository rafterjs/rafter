import { IDiAutoloader } from '@rafterjs/di-autoloader';
import { ILogger, ILoggerFactory } from '@rafterjs/logger-plugin';
import { IMiddleware, IMiddlewares } from './IMiddleware';

export interface IMiddlewareProvider {
  createInstance(middlewareConfig: IMiddlewares): IMiddleware[];
}

export default class MiddlewareProvider implements IMiddlewareProvider {
  private readonly logger: ILogger;

  constructor(private readonly diAutoloader: IDiAutoloader, private readonly loggerFactory: ILoggerFactory) {
    this.logger = loggerFactory('middleware provider');
  }

  public createInstance(middleware: IMiddlewares): IMiddleware[] {
    const middlewareCollection: IMiddleware[] = [];

    this.logger.info(`    Creating middleware from:`, middleware);

    for (const middlewareServiceName of middleware) {
      try {
        this.logger.info(`    Adding middleware: ${middlewareServiceName}`);
        const middlewareFunction = this.diAutoloader.get<IMiddleware>(middlewareServiceName);
        middlewareCollection.push(middlewareFunction);
      } catch (error) {
        this.logger.error(`    Could not add middleware: ${middlewareServiceName}`, error);
      }
    }

    return middlewareCollection;
  }
}
