import { IService } from './vendor';

export interface IRafter {
  start(): Promise<void>;

  stop(): Promise<void>;

  get<T>(serviceName: string): T;

  register<T>(name: string, service: IService<T>): void;
}
