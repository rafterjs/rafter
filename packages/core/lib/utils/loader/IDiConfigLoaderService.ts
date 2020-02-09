import { IConfig } from './IConfig';

export interface IDiConfigLoaderService {
  getDiConfig(): Promise<IConfig>;
}
