import { ILogger } from '@rafterjs/utils';
import cors, { CorsOptions } from 'cors';
import { NextFunction, Request, Response } from 'express-serve-static-core';

export default function corsFactory(config: CorsOptions = {}, logger: ILogger) {
  return (req: Request, res: Response, next: NextFunction): void => {
    logger.debug(`    CORS middleware`, config);
    cors(config)(req, res, next);
  };
}
