import { IConfig } from './IConfig';

export interface IDiConfigLoaderStrategy {
  getConfigFromDirectory(directory: string): Promise<IConfig>;
}
