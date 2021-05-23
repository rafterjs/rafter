import { IPlugin, IPlugins } from '@rafterjs/api';

export default (): IPlugins =>
  new Set<IPlugin>(['@rafterjs/logger-plugin', '@rafterjs/utils', '@rafterjs/cors-plugin']);
