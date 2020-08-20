import { ILogger } from '@rafterjs/logger-plugin';
import { IDiAutoloader, IMergableFileNames, IMergableFiles, IPath, IPaths } from './IDiAutoloader';
import { IDiContainer } from './IDiContainer';
import { IService } from './IService';
import { IServiceConfig } from './IServiceConfig';
import { DiAutoloader } from './DiAutoloader';
import diContainerFactory from './diContainer';

export interface IDiAutoloaderOptions {
  logger?: ILogger;
}

export const diAutoloaderFactory = ({ logger }: IDiAutoloaderOptions): IDiAutoloader => {
  const container: IDiContainer = diContainerFactory();
  return new DiAutoloader(container.createScope(), logger);
};

export default diAutoloaderFactory;

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
