import { ILogger } from '@rafterjs/logger-plugin';

export default (logger: ILogger) => () => {
  logger.info('A very simple lambda');
};
