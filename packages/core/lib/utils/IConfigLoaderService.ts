import { IConfig } from './IConfig';

export interface IConfigLoaderService {
  getConfig(): Promise<IConfig>;
}
