import { Box } from 'box-di';
import { ILogger } from '../utils/ILogger';

export interface IDiContainer {
  setLogger(logger: ILogger): void;

  get<T>(serviceName: string): T;

  register<T>(serviceName: string, service: T): void;

  registerInvokable<T>(serviceName: string, service: T, dependencies: string[]): void;
}

export default (): IDiContainer => {
  return Box;
};
