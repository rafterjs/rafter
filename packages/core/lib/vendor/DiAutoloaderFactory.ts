import { AwilixContainer } from 'awilix';
import { DiAutoloader, IDiAutoloader } from '@rafter/di-autoloader';
import { ILogger } from '../utils/logger/ILogger';

export default (container: AwilixContainer, logger: ILogger): IDiAutoloader => {
  return new DiAutoloader(container, logger);
};
