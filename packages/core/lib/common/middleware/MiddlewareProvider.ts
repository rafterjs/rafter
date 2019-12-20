import { IDiContainer } from '@rafter/di-container';
import { ILogger } from '../../utils/logger/ILogger';
import { IMiddleware, IMiddlewareConfig } from './IMiddleware';

export interface IMiddlewareProvider {
  createInstance(middlewareConfig: string[]): IMiddleware | IMiddleware[];
}

/**
 *
 * @param {IDiContainer} diContainer
 * @param {Logger} logger
 * @return {MiddlewareProvider}
 */

export default class MiddlewareProvider implements IMiddlewareProvider {
  private readonly diContainer: IDiContainer;

  private readonly logger: ILogger;

  constructor(diContainer: IDiContainer, logger: ILogger) {
    this.diContainer = diContainer;
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
        const middleware = this.diContainer.get<IMiddleware>(middlewareServiceName);
        middlewareCollection.push(middleware);
      } catch (error) {
        this.logger.error(`    Could not add middleware: ${middlewareServiceName}`, error);
      }
    });

    return middlewareCollection;
  }
}
