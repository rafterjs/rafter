import cors, { CorsOptions } from 'cors';
import { INextFunction, IRequest, IResponse } from 'rafter';
import { ILogger } from '@rafterjs/logger-plugin';

export default function corsFactory(logger: ILogger, config: CorsOptions = {}) {
  return (req: IRequest, res: IResponse, next: INextFunction): void => {
    logger.debug(`    CORS middleware`);
    cors(config)(req, res, next);
  };
}
