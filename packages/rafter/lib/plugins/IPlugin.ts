export type IPlugin = {
  plugin: string;
  name: string;
  path: string;
};

export type IPluginsConfig = Set<IPlugin>;

export type IPlugins = IPluginsConfig;
