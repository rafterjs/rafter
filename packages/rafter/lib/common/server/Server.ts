import { Express } from 'express';
import * as http from 'http';
import * as https from 'https';
import { ILogger } from '@rafterjs/logger-plugin';
import { RequestHandler } from 'express-serve-static-core';
import { IPreStartHookConfig, IPreStartHooksProvider } from '../pre-start-hooks';
import { IRoutesProvider } from '../router/RoutesProvider';
import { IMiddlewareConfig, IMiddlewareProvider } from '../middleware';

import { IRouteConfig } from '../router';

import { IPluginProvider, IPluginsConfig } from '../plugins';
import { IRafterServerConfig } from '../../config/IRafterServerConfig';

export interface IServer {
  start(): Promise<void>;

  stop(): Promise<void>;
}

export default class Server implements IServer {
  private serverInstance?: http.Server | https.Server;

  constructor(
    private readonly express: Express,
    private readonly routesProvider: IRoutesProvider,
    private readonly middlewareProvider: IMiddlewareProvider,
    private readonly preStartHooksProvider: IPreStartHooksProvider,
    private readonly pluginProvider: IPluginProvider,
    private readonly middleware: IMiddlewareConfig[] = [],
    private readonly routes: IRouteConfig[] = [],
    private readonly preStartHooks: IPreStartHookConfig[] = [],
    private readonly plugins: IPluginsConfig,
    private readonly config: IRafterServerConfig = { server: { port: 3000 } },
    private readonly logger: ILogger = console,
  ) {}

  /**
   * Runs all the pre start hooks that have been registered
   */
  private async initPreStartHooks(): Promise<void> {
    if (this.preStartHooks.length > 0) {
      // get the hooks from config
      const hooks = this.preStartHooksProvider.createInstance(this.preStartHooks);

      // run the hooks
      for (const hook of hooks) {
        try {
          await hook();
        } catch (e) {
          this.logger.error(`The hook is not a function`, hook, e);
        }
      }
    }

    return Promise.resolve();
  }

  /**
   * Initializes all the middleware from the provided config.
   */
  private async initMiddleware(): Promise<void> {
    // TODO re-merge any middleware
    if (this.middleware.length > 0) {
      const middlewareFunctions: RequestHandler[] = this.middlewareProvider.createInstance(this.middleware);
      if (middlewareFunctions.length > 0) {
        this.express.use(middlewareFunctions);
      }
    }
  }

  private async initRoutes(): Promise<void> {
    if (this.routes.length > 0) {
      this.express.use(this.routesProvider.createInstance(this.routes));
    }
  }

  public async start(): Promise<void> {
    if (!this.serverInstance) {
      // get all plugins
      // this.logger.info(`ExpressServer::start plugins have already been loaded`);

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
        const { ssl = {} } = this.config.server;
        const { enabled = false, certificate, privateKey, password } = ssl;
        if (enabled) {
          if (!certificate && !privateKey) {
            throw new Error('SSL is enabled but there is no certificate and private key');
          }

          this.logger.info(`ExpressServer::start ssl enabled`);
          this.serverInstance = https.createServer(
            { key: privateKey, cert: certificate, passphrase: password },
            this.express,
          );
        } else {
          this.serverInstance = http.createServer(this.express);
        }

        this.serverInstance.listen(this.config.server.port);
        this.logger.info(`ExpressServer::start Server running on port ${this.config.server.port}`);

        resolve();
      });
    }

    this.logger.warn(`ExpressServer::start Server is already running on port ${this.config}`);
    return Promise.reject();
  }

  public async stop(): Promise<void> {
    if (this.serverInstance) {
      this.serverInstance.close();
      this.serverInstance = undefined;
    }
  }
}
