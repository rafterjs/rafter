export type IPluginConfig = object;

export type IPlugin = {};

export type IPluginsConfig = Map<string, IPluginConfig>;

export type IPlugins = Map<IPlugin, IPluginConfig>;
