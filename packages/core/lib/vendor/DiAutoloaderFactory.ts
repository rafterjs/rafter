import { Box } from '@rafter/di-container';
import { IDiAutoloader, DiAutoloader } from '@rafter/di-autoloader';
import { ILogger } from '../utils/logger/ILogger';
import { IServiceConfig } from '../common/IService';

export default (services: IServiceConfig, logger: ILogger): IDiAutoloader => {
  return new DiAutoloader(services, Box, logger);
};
