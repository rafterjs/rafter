import ConfigDto from './ConfigDto';

export interface IConfigAutoloader {
  get(directory: string): Promise<ConfigDto>;
}
