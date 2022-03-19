import { ILogger, ILoggerFactory } from '@rafterjs/logger-plugin';
import * as http from 'http';
import * as https from 'https';
import { IPluginsConfig } from '../../../plugins';
import { IServerConfig } from '../../config/IServerConfig';
import { IMiddleware, IMiddlewareProvider, IMiddlewares } from '../middleware';
import { IPreStartHooks, IPreStartHooksProvider } from '../pre-start-hooks';
import { IRoutes } from '../router';
import { Express } from '../../vendor';
import { IRoutesProvider } from '../router/RoutesProvider';

export interface IServer {
  start(): Promise<void>;

  stop(): Promise<void>;

  getHttpServerInstance(): http.Server | https.Server | undefined;

  getApplicationInstance(): Express;
}

export default class Server implements IServer {
  private readonly logger: ILogger;

  private httpServer?: http.Server | https.Server;

  constructor(
    private readonly express: Express,
    private readonly routesProvider: IRoutesProvider,
    private readonly middlewareProvider: IMiddlewareProvider,
    private readonly preStartHooksProvider: IPreStartHooksProvider,
    private readonly middleware: IMiddlewares = new Set(),
    private readonly routes: IRoutes = new Set(),
    private readonly preStartHooks: IPreStartHooks = new Set(),
    private readonly plugins: IPluginsConfig,
    private readonly config: IServerConfig = { server: { port: 3000 } },
    private readonly loggerFactory: ILoggerFactory,
  ) {
    this.logger = loggerFactory('server');
  }

  /**
   * Runs all the pre start hooks that have been registered
   */
  private async initPreStartHooks(): Promise<void> {
    if (this.preStartHooks.size > 0) {
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
    if (this.middleware.size > 0) {
      const middlewareFunctions: IMiddleware[] = this.middlewareProvider.createInstance(this.middleware);
      if (middlewareFunctions.length > 0) {
        this.express.use(middlewareFunctions);
      }
    }
  }

  private async initRoutes(): Promise<void> {
    if (this.routes.size > 0) {
      this.express.use(this.routesProvider.createInstance(this.routes));
    }
  }

  public async start(): Promise<void> {
    if (!this.httpServer) {
      // get all plugins
      // this.logger.info(`plugins have already been loaded`);

      // add all the middleware
      this.logger.info(`Running pre-start hooks`);
      await this.initPreStartHooks();

      // add all the middleware
      this.logger.info(`Applying middleware`);
      await this.initMiddleware();

      // add the router
      this.logger.info(`Applying the router`);
      await this.initRoutes();

      return new Promise((resolve): void => {
        const { ssl = {} } = this.config.server;
        const { enabled = false, certificate, privateKey, password } = ssl;
        if (enabled) {
          if (!certificate && !privateKey) {
            throw new Error('SSL is enabled but there is no certificate and private key');
          }

          this.logger.info(`SSL enabled`);
          this.httpServer = https.createServer(
            { key: privateKey, cert: certificate, passphrase: password },
            this.express,
          );
        } else {
          this.httpServer = http.createServer(this.express);
        }

        this.httpServer.listen(this.config.server.port);
        this.logger.info(`Server running on port ${this.config.server.port}`);

        resolve();
      });
    }

    this.logger.warn(`Server is already running on port ${this.config}`);
    return Promise.reject();
  }

  public async stop(): Promise<void> {
    if (this.httpServer) {
      this.httpServer.close();
      this.httpServer = undefined;
    }
  }

  public getHttpServerInstance(): http.Server | https.Server | undefined {
    return this.httpServer;
  }

  public getApplicationInstance(): Express {
    return this.express;
  }
}
