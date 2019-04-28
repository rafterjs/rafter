import { IPreStartHookConfig } from '../pre-start-hooks/IPreStartHook';
import { Express } from 'express';
import { IRoutesProvider } from '../router/RoutesProvider';
import { IMiddlewareProvider } from '../middleware/MiddlewareProvider';
import { IPreStartHooksProvider } from '../pre-start-hooks/PreStartHooksProvider';
import { IRouteConfig } from '../router/IRouteConfig';
import { IMiddleWareConfig } from '../middleware/IMiddleware';
import { ILogger } from '../../utils/ILogger';
import * as http from 'http';
import { RequestHandler } from 'express-serve-static-core';

export interface IServer {
  start(): Promise<void>;

  stop(): Promise<void>;
}

/**
 * @param {object} express
 * @param {RoutesProvider} routerProvider
 * @param {MiddlewareProvider} middlewareProvider
 * @param {PreStartHooksProvider} preStartHookProvider
 * @param {string[]=} middlewareConfig
 * @param {object[]=} routesConfig
 * @param {Function[]=} preStartHooks
 * @param {number=} serverPort
 * @param {Logger} logger
 *
 * @return {Server}
 */
export default class Server implements IServer {
  serverInstance: http.Server;
  express: Express;
  routerProvider: IRoutesProvider;
  middlewareProvider: IMiddlewareProvider;
  preStartHookProvider: IPreStartHooksProvider;
  middlewareConfig: IMiddleWareConfig[] = [];
  routesConfig: IRouteConfig[] = [];
  preStartHooks: IPreStartHookConfig[] = [];
  serverPort: number;
  logger: ILogger;

  constructor(
    express: Express,
    routerProvider: IRoutesProvider,
    middlewareProvider: IMiddlewareProvider,
    preStartHookProvider: IPreStartHooksProvider,
    middlewareConfig: IMiddleWareConfig[] = [],
    routesConfig: IRouteConfig[] = [],
    preStartHooks: IPreStartHookConfig[] = [],
    serverPort: number = 3000,
    logger: ILogger = console
  ) {
    this.express = express;
    this.routerProvider = routerProvider;
    this.middlewareProvider = middlewareProvider;
    this.preStartHookProvider = preStartHookProvider;
    this.middlewareConfig = middlewareConfig;
    this.routesConfig = routesConfig;
    this.preStartHooks = preStartHooks;
    this.serverPort = serverPort;
    this.logger = logger;
  }

  /**
   * Runs all the pre start hooks that have been registered
   *
   * @private
   */
  private async initPreStartHooks() {
    if (this.preStartHooks.length > 0) {
      // get the hooks from config
      const hooks = this.preStartHookProvider.createInstance(this.preStartHooks);

      // run the hooks
      Object.values(hooks).forEach(async hook => {
        await hook();
      });
    }
  }

  /**
   * Initializes all the middleware from the provided config.
   *
   * @private
   */
  private async initMiddleware() {
    if (this.middlewareConfig.length > 0) {
      this.express.use(this.middlewareProvider.createInstance(this.middlewareConfig) as (
        | RequestHandler
        | RequestHandler[]));
    }
  }

  /**
   * @private
   */
  private async initRoutes() {
    if (this.routesConfig.length > 0) {
      this.express.use(this.routerProvider.createInstance(this.routesConfig));
    }
  }

  /**
   * @return {Promise.<void>}
   */
  public async start(): Promise<void> {
    if (!this.serverInstance) {
      // add all the middleware
      this.logger.info(`ExpressServer::start running pre-start hooks`);
      await this.initPreStartHooks();

      // add all the middleware
      this.logger.info(`ExpressServer::start applying middleware`);
      await this.initMiddleware();

      // add the router
      this.logger.info(`ExpressServer::start applying the router`);
      await this.initRoutes();

      return new Promise((resolve, reject) => {
        this.serverInstance = this.express.listen(this.serverPort, error => {
          if (error) {
            this.logger.error(error);
            reject(error);
          }

          this.logger.info(`ExpressServer::start Server running on port ${this.serverPort}`);
          resolve();
        });
      });
    }

    this.logger.warn(`ExpressServer::start Server is already running on port ${this.serverPort}`);
    return Promise.reject();
  }

  /**
   * @return {Promise.<void>}
   */
  public async stop() {
    if (this.serverInstance) {
      this.serverInstance.close();
      this.serverInstance = undefined;
    }
  }
}
