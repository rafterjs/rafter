import { Express } from 'express';
import * as http from 'http';
import { ILogger } from '@rafterjs/utils';
import { RequestHandler } from 'express-serve-static-core';
import { IPreStartHookConfig, IPreStartHooksProvider } from '../pre-start-hooks';
import { IRoutesProvider } from '../router/RoutesProvider';
import { IMiddlewareProvider, IMiddlewareConfig } from '../middleware';

import { IRouteConfig } from '../router';

import { IPluginProvider } from '../plugins';
import { IRafterConfig } from '../../config/IRafterConfig';

export interface IServer {
  start(): Promise<void>;

  stop(): Promise<void>;
}

export default class Server implements IServer {
  private serverInstance?: http.Server;

  private readonly express: Express;

  private readonly routesProvider: IRoutesProvider;

  private readonly middlewareProvider: IMiddlewareProvider;

  private readonly preStartHooksProvider: IPreStartHooksProvider;

  private readonly middlewareConfig: IMiddlewareConfig[] = [];

  private readonly routes: IRouteConfig[] = [];

  private readonly preStartHooks: IPreStartHookConfig[] = [];

  private readonly pluginProvider: IPluginProvider;

  private readonly config: IRafterConfig;

  private readonly logger: ILogger;

  constructor(
    express: Express,
    routesProvider: IRoutesProvider,
    middlewareProvider: IMiddlewareProvider,
    preStartHooksProvider: IPreStartHooksProvider,
    pluginProvider: IPluginProvider,
    middlewareConfig: IMiddlewareConfig[] = [],
    routes: IRouteConfig[] = [],
    preStartHooks: IPreStartHookConfig[] = [],
    config: IRafterConfig = { server: { port: 3000 } },
    logger: ILogger = console,
  ) {
    this.express = express;

    this.routesProvider = routesProvider;
    this.middlewareProvider = middlewareProvider;
    this.preStartHooksProvider = preStartHooksProvider;
    this.pluginProvider = pluginProvider;
    this.middlewareConfig = middlewareConfig;
    this.routes = routes;
    this.preStartHooks = preStartHooks;

    this.config = config;
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
      const hooks = this.preStartHooksProvider.createInstance(this.preStartHooks);

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
    if (this.routes.length > 0) {
      this.express.use(this.routesProvider.createInstance(this.routes));
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

      return new Promise((resolve): void => {
        this.serverInstance = this.express.listen(this.config.server.port, (): void => {
          this.logger.info(`ExpressServer::start Server running on port ${this.config.server.port}`);
          resolve();
        });
      });
    }

    this.logger.warn(`ExpressServer::start Server is already running on port ${this.config}`);
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
