import { ILogger } from '../../utils/ILogger';
import { IDiContainer } from '../../vendor/BoxDiFactory';
import { IMiddleWare, IMiddleWareConfig } from './IMiddleware';

export interface IMiddlewareProvider {
  createInstance(middlewareConfig: string[]): Array<IMiddleWare | IMiddleWare[]>;
}

/**
 *
 * @param {IDiContainer} diContainer
 * @param {Logger} logger
 * @return {MiddlewareProvider}
 */

export default class MiddlewareProvider implements IMiddlewareProvider {
  diContainer: IDiContainer;
  logger: ILogger;

  constructor(diContainer: IDiContainer, logger: ILogger) {
    this.diContainer = diContainer;
    this.logger = logger;
  }

  /**
   * @param {string[]} middlewareConfig
   * @return {Function|Function[]}
   */
  public createInstance(middlewareConfig: IMiddleWareConfig[]): Array<IMiddleWare | IMiddleWare[]> {
    const middlewareCollection: Array<IMiddleWare | IMiddleWare[]> = [];

    Object.values(middlewareConfig).forEach(middlewareServiceName => {
      try {
        this.logger.info(`    Adding middleware: ${middlewareServiceName}`);
        const middleware = this.diContainer.get<IMiddleWare | IMiddleWare[]>(middlewareServiceName);
        middlewareCollection.push(middleware);
      } catch (error) {
        this.logger.error(`    Could not add middleware: ${middlewareServiceName}`, error);
      }
    });

    return middlewareCollection;
  }
}
