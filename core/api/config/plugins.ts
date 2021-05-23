import { IPlugin, IPluginsConfig } from 'rafter';

export default (): IPluginsConfig =>
  new Set<IPlugin>(['@rafterjs/logger-plugin', '@rafterjs/utils', '@rafterjs/cors-plugin']);
