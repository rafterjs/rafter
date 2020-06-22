export type IPluginConfig = object;

export type IPlugin = {
  plugin: string;
  name: string;
  path: string;
};

export type IPluginsConfig = IPlugin[];

export type IPlugins = IPluginsConfig;
