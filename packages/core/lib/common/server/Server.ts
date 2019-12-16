import { Express } from 'express';
import * as http from 'http';
import { RequestHandler } from 'express-serve-static-core';
import { IPreStartHookConfig } from '../pre-start-hooks/IPreStartHook';
import { IRoutesProvider } from '../router/RoutesProvider';
import { IMiddlewareProvider } from '../middleware/MiddlewareProvider';
import { IPreStartHooksProvider } from '../pre-start-hooks/PreStartHooksProvider';
import { IRouteConfig } from '../router/IRouteConfig';
import { IMiddlewareConfig } from '../middleware/IMiddleware';
import { ILogger } from '../../utils/ILogger';
import { IPluginProvider } from '../plugins/PluginProvider';
import { IConfig } from '../../utils/IConfig';

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
  private serverInstance?: http.Server;

  private readonly express: Express;

  private readonly routerProvider: IRoutesProvider;

  private readonly middlewareProvider: IMiddlewareProvider;

  private readonly preStartHookProvider: IPreStartHooksProvider;

  private readonly middlewareConfig: IMiddlewareConfig[] = [];

  private readonly routesConfig: IRouteConfig[] = [];

  private readonly preStartHooks: IPreStartHookConfig[] = [];

  private readonly pluginProvider: IPluginProvider;

  private readonly serverPort: number;

  private readonly logger: ILogger;

  constructor(
    express: Express,
    routerProvider: IRoutesProvider,
    middlewareProvider: IMiddlewareProvider,
    preStartHookProvider: IPreStartHooksProvider,
    pluginProvider: IPluginProvider,
    middlewareConfig: IMiddlewareConfig[] = [],
    routesConfig: IRouteConfig[] = [],
    preStartHooks: IPreStartHookConfig[] = [],
    serverPort = 3000,
    logger: ILogger = console,
  ) {
    this.express = express;
    this.routerProvider = routerProvider;
    this.middlewareProvider = middlewareProvider;
    this.preStartHookProvider = preStartHookProvider;
    this.pluginProvider = pluginProvider;
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
  private async initPreStartHooks(): Promise<void> {
    if (this.preStartHooks.length > 0) {
      // get the hooks from config
      const hooks = this.preStartHookProvider.createInstance(this.preStartHooks);

      // run the hooks
      Object.values(hooks).forEach(
        async (hook): Promise<void> => {
          await hook();
        },
      );
    }

    return Promise.resolve();
  }

  /**
   * Initializes all the middleware from the provided config.
   *
   * @private
   */
  private async initMiddleware(): Promise<void> {
    this.logger.info('--------------middleware', this.middlewareConfig);
    if (this.middlewareConfig.length > 0) {
      this.express.use(
        this.middlewareProvider.createInstance(this.middlewareConfig) as RequestHandler | RequestHandler[],
      );
    }
  }

  /**
   * @private
   */
  private async initRoutes(): Promise<void> {
    if (this.routesConfig.length > 0) {
      this.express.use(this.routerProvider.createInstance(this.routesConfig));
    }
  }

  /**
   * @return {Promise.<void>}
   */
  public async start(): Promise<void> {
    if (!this.serverInstance) {
      // get all plugins
      this.logger.info(`ExpressServer::start loading plugins`);
      // TODO get plugins

      // add all the middleware
      this.logger.info(`ExpressServer::start running pre-start hooks`);
      await this.initPreStartHooks();

      // add all the middleware
      this.logger.info(`ExpressServer::start applying middleware`);
      await this.initMiddleware();

      // add the router
      this.logger.info(`ExpressServer::start applying the router`);
      await this.initRoutes();

      return new Promise((resolve, reject): void => {
        this.serverInstance = this.express.listen(this.serverPort, (error: Error): void => {
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
  public async stop(): Promise<void> {
    if (this.serverInstance) {
      this.serverInstance.close();
      this.serverInstance = undefined;
    }
  }
}
