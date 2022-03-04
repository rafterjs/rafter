import { IPlugin, IPluginsConfig } from 'rafter';

export default (): IPluginsConfig => new Set<IPlugin>(['@rafterjs/utils']);
