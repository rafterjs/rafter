export type IPluginConfig = object;

export type IPlugin = {};

export type IPluginsConfig = {
  [moduleName: string]: IPluginConfig;
};

export type IPlugins = Map<IPlugin, IPluginConfig>;
