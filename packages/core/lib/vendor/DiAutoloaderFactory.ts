import { AwilixContainer } from 'awilix';
import { DiAutoloader, IDiAutoloader } from '@rafter/di-autoloader';
import { ILogger } from '../utils/logger/ILogger';
import { IServiceConfig } from '../common/IService';

export default (services: IServiceConfig, container: AwilixContainer, logger: ILogger): IDiAutoloader => {
  return new DiAutoloader(services, container, logger);
};
