import ConfigDto from './ConfigDto';

export interface IConfigAutoloader {
  getConfigFromDirectory(directory: string): Promise<ConfigDto>;
}
