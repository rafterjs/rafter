import { IPluginConfig } from 'rafter';
import { join } from 'path';

const modulesPath = join(__dirname, '../../../node_modules/@rafterjs');

export default (): IPluginConfig => [
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
  {
    plugin: '@rafterjs/mongodb-plugin',
    path: join(modulesPath, 'mongodb-plugin/dist/**'),
    name: 'mongodb',
  },
];
