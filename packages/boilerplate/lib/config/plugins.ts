import { join } from 'path';
import { IPlugin, IPlugins } from 'rafter';

const modulesPath = join(__dirname, '../../../node_modules/@rafterjs');

export default (): IPlugins =>
  new Set<IPlugin>([
    {
      plugin: '@rafterjs/logger-plugin',
      path: join(modulesPath, 'logger-plugin/dist/**'),
      name: 'logger',
    },
    {
      plugin: '@rafterjs/cors-plugin',
      path: join(modulesPath, 'cors-plugin/dist/**'),
      name: 'cors',
    },
  ]);
