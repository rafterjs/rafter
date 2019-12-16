export interface IPluginConfigFile {
  [moduleName: string]: IPluginConfig;
}

export type IPluginConfig = object;

export type IPlugin = {};

export type IPluginsConfig = Map<IPlugin, IPluginConfig>;
