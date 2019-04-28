import { Box } from 'box-di';
import { IDiAutoloader, BoxDiAutoLoader } from 'box-di-autoloader';
import { ILogger } from '../utils/ILogger';
import { IServiceConfig } from '../common/IService';

export default (services: IServiceConfig, logger: ILogger): IDiAutoloader => {
  return new BoxDiAutoLoader(services, Box, logger);
};
