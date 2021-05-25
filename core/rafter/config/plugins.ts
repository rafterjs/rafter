import { IPlugin, IPluginsConfig } from '../lib';

export default (): IPluginsConfig => new Set<IPlugin>(['@rafterjs/logger-plugin', '@rafterjs/utils']);
