import { IPlugin, IPlugins } from 'rafter';

export default (): IPlugins =>
  new Set<IPlugin>(['@rafterjs/logger-plugin', '@rafterjs/apollo-server-plugin', '@rafterjs/cors-plugin']);
