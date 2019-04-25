import {IMiddleWareConfig} from '../common/middleware/IMiddleware';
import {IRouteConfig} from '../common/router/IRouteConfig';
import {IPreStartHook, IPreStartHookConfig} from '../common/pre-start-hooks/IPreStartHook';
import {IServiceConfig} from '../common/IService';

/**
 * A config dto which holds information about services, middleware, routes and misc config. This is used primarily for
 * the autoloaders and to be put into the DI container for later use by services.
 *
 * @return {ConfigDto}
 */
export default class ConfigDto {
  config: any = {};
  services: IServiceConfig = {};
  middleware: IMiddleWareConfig[] = [];
  routes: IRouteConfig[] = [];
  preStartHooks: IPreStartHookConfig[] = [];

  /**
   * @return {object}
   */
  public getConfig() {
    return this.config;
  };

  /**
   * @param {any} newConfig
   * @return {ConfigDto}
   */
  public addConfig(newConfig: any) {
    this.config = {
      ...this.config,
      ...newConfig,
    };
    return this;
  };

  /**
   * @return {IPreStartHook[]}
   */
  public getPreStartHooks(): IPreStartHookConfig[] {
    return this.preStartHooks;
  };

  /**
   * @param {IPreStartHook[]} newPreStartHooks
   * @return {ConfigDto}
   */
  public addPreStartHooks(newPreStartHooks: IPreStartHookConfig[]) {
    this.preStartHooks = [...this.preStartHooks, ...newPreStartHooks];
    return this;
  };

  /**
   * @return {object}
   */
  public getServices(): IServiceConfig {
    return this.services;
  };

  /**
   * @param {IServiceConfig} newServices
   * @return {ConfigDto}
   */
  public addServices(newServices: IServiceConfig) {
    this.services = {
      ...this.services,
      ...newServices,
    };
    return this;
  };

  /**
   * @return {object}
   */
  public getMiddleware(): IMiddleWareConfig[] {
    return this.middleware;
  };

  /**
   * @param {IMiddleWareConfig[]} newMiddleware
   * @return {ConfigDto}
   */
  public addMiddleware(newMiddleware: IMiddleWareConfig[]) {
    this.middleware = [...this.middleware, ...newMiddleware];
    return this;
  };

  /**
   * @return {object}
   */
  public getRoutes(): IRouteConfig[] {
    return this.routes;
  };

  /**
   * @param {IRouteConfig[]} newRoutes
   * @return {ConfigDto}
   */
  public addRoutes(newRoutes: IRouteConfig[] = []) {
    this.routes = [...this.routes, ...newRoutes];
    return this;
  }
}
