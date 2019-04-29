import { IDiContainer } from '@rafter/di-container';
import { ILogger } from '../../utils/ILogger';
import { IMiddleWare, IMiddleWareConfig } from './IMiddleware';

export interface IMiddlewareProvider {
  createInstance(middlewareConfig: string[]): IMiddleWare | IMiddleWare[];
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
  public createInstance(middlewareConfig: IMiddleWareConfig[]): IMiddleWare | IMiddleWare[] {
    const middlewareCollection: IMiddleWare | IMiddleWare[] = [];

    Object.values(middlewareConfig).forEach(middlewareServiceName => {
      try {
        this.logger.info(`    Adding middleware: ${middlewareServiceName}`);
        const middleware = this.diContainer.get<IMiddleWare>(middlewareServiceName);
        middlewareCollection.push(middleware);
      } catch (error) {
        this.logger.error(`    Could not add middleware: ${middlewareServiceName}`, error);
      }
    });

    return middlewareCollection;
  }
}
