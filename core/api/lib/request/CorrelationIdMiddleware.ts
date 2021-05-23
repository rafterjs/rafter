import { ILoggerFactory } from '@rafterjs/logger-plugin';
import { UuidHelper } from '@rafterjs/utils';
import { IMiddleware, INextFunction, IRequest, IResponse } from 'rafter';
import { HttpContextHelper } from '../utils/HttpContextHelper';
import { RequestHelper } from './RequestHelper';

export function correlationIdMiddleware(
  httpContextHelper: HttpContextHelper,
  requestHelper: RequestHelper,
  uuidHelper: UuidHelper,
  loggerFactory: ILoggerFactory,
): IMiddleware {
  const logger = loggerFactory('CorrelationIdMiddleware');
  return async (request: IRequest, response: IResponse, next: INextFunction) => {
    const uuid = requestHelper.getTransactionIdFromHeader(request) || uuidHelper.create();

    // set all the correlation headers
    httpContextHelper.setTransactionId(uuid);

    logger.debug(`Applying the correlation id: ${uuid}`);

    next();
  };
}

export default correlationIdMiddleware;
