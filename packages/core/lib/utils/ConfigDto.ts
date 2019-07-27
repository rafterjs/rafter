import { IMiddleWareConfig } from '../common/middleware/IMiddleware';
import { IRouteConfig } from '../common/router/IRouteConfig';
import { IPreStartHookConfig } from '../common/pre-start-hooks/IPreStartHook';
import { IServiceConfig } from '../common/IService';

/**
 * A config dto which holds information about services, middleware, routes and misc config. This is used primarily for
 * the autoloaders and to be put into the DI container for later use by services.
 *
 * @return {ConfigDto}
 */
export default class ConfigDto {
  private config: object = {};

  private services: IServiceConfig = {};

  private middleware: IMiddleWareConfig[] = [];

  private routes: IRouteConfig[] = [];

  private preStartHooks: IPreStartHookConfig[] = [];

  public getConfig(): object {
    return this.config;
  }

  public addConfig(newConfig: object): ConfigDto {
    this.config = {
      ...this.config,
      ...newConfig,
    };
    return this;
  }

  public getPreStartHooks(): IPreStartHookConfig[] {
    return this.preStartHooks;
  }

  public addPreStartHooks(newPreStartHooks: IPreStartHookConfig[]): ConfigDto {
    this.preStartHooks = [...this.preStartHooks, ...newPreStartHooks];
    return this;
  }

  public getServices(): IServiceConfig {
    return this.services;
  }

  public addServices(newServices: IServiceConfig): ConfigDto {
    this.services = {
      ...this.services,
      ...newServices,
    };
    return this;
  }

  public getMiddleware(): IMiddleWareConfig[] {
    return this.middleware;
  }

  public addMiddleware(newMiddleware: IMiddleWareConfig[]): ConfigDto {
    this.middleware = [...this.middleware, ...newMiddleware];
    return this;
  }

  public getRoutes(): IRouteConfig[] {
    return this.routes;
  }

  public addRoutes(newRoutes: IRouteConfig[] = []): ConfigDto {
    this.routes = [...this.routes, ...newRoutes];
    return this;
  }
}
