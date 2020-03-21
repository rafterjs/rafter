import DiAutoloader, { IDiAutoloader, IDiContainer } from '@rafter/di-autoloader';
import { ILogger } from '@rafter/utils';

export interface IDiAutoloaderOptions {
  diContainer: IDiContainer;
  logger?: ILogger;
}

export default ({ diContainer, logger }: IDiAutoloaderOptions): IDiAutoloader => {
  return new DiAutoloader(diContainer, logger);
};
