import { IConfig } from './IConfig';

export interface IConfigLoaderStrategy {
  getConfig(directory: string): Promise<IConfig>;
}
