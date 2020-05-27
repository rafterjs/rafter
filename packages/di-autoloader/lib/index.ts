import { ILogger } from '@rafterjs/utils';
import { IDiAutoloader, IMergableFileNames, IMergableFiles, IPaths, IPath } from './IDiAutoloader';
import { IDiContainer } from './IDiContainer';
import { IService } from './IService';
import { IServiceConfig } from './IServiceConfig';
import { DiAutoloader } from './DiAutoloader';
import diContainerFactory from './diContainer';

export interface IDiAutoloaderOptions {
  logger?: ILogger;
}

export default ({ logger }: IDiAutoloaderOptions): IDiAutoloader => {
  const container: IDiContainer = diContainerFactory();
  return new DiAutoloader(container, logger);
};

export {
  DiAutoloader,
  IDiAutoloader,
  IDiContainer,
  IService,
  IServiceConfig,
  IPaths,
  IPath,
  IMergableFiles,
  IMergableFileNames,
};
