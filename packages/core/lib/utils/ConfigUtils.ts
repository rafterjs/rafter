import { IConfig } from './IConfig';

export function merge(configToMergInto: IConfig, ...configs: IConfig[]): void {
  configs.forEach(config => {
    configToMergInto
      .addPlugins(config.getPlugins())
      .addConfig(config.getConfig())
      .addMiddleware(config.getMiddleware())
      .addPreStartHooks(config.getPreStartHooks())
      .addRoutes(config.getRoutes())
      .addServices(config.getServices());
  });
}