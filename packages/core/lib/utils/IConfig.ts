import { IMiddlewareConfig } from '../common/middleware/IMiddleware';
import { IRouteConfig } from '../common/router/IRouteConfig';
import { IPreStartHookConfig } from '../common/pre-start-hooks/IPreStartHook';
import { IServiceConfig } from '../common/IService';
import { IPlugin, IPluginConfig } from '../common/plugins/IPlugin';

export interface IConfig {
  getConfig(): object;

  addConfig(newConfig: object): IConfig;

  getPreStartHooks(): IPreStartHookConfig[];

  addPreStartHooks(newPreStartHooks: IPreStartHookConfig[]): IConfig;

  getServices(): IServiceConfig;

  addServices(newServices: IServiceConfig): IConfig;

  getMiddleware(): IMiddlewareConfig[];

  addMiddleware(newMiddleware: IMiddlewareConfig[]): IConfig;

  getRoutes(): IRouteConfig[];

  addRoutes(newRoutes: IRouteConfig[]): IConfig;

  getPlugins(): IPluginConfig<IConfig>;

  addPlugins(plugin: IPluginConfig<IConfig>): IConfig;
}

export type IConfigTypes = IPreStartHookConfig | IServiceConfig | IMiddlewareConfig | IRouteConfig | object;
