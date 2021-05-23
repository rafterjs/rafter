import { ILoggerFactory } from '@rafterjs/logger-plugin';
import { IMiddleware, INextFunction, IRequest, IResponse } from 'rafter';

export default (loggerFactory: ILoggerFactory): IMiddleware => {
  const logger = loggerFactory('RequestLoggerMiddleware');
  return (request: IRequest, response: IResponse, next: INextFunction): void => {
    logger.info(`${request.method.toUpperCase()} ${request.protocol}://${request.get('host')}${request.originalUrl}`);

    next();
  };
};
