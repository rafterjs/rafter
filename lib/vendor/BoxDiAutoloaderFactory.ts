import { Box } from 'box-di';
import BoxDiAutoLoader from 'box-di-autoloader';
import { ILogger } from '../utils/ILogger';
import { IServiceConfig } from '../common/IService';

export interface IDiAutoloader {
  load(): void;

  get<T>(serviceName: string): T;
}

export default (services: IServiceConfig, logger: ILogger): IDiAutoloader => {
  return new BoxDiAutoLoader(services, Box, logger);
};
