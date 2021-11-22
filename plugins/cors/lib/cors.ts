import cors, { CorsOptions } from 'cors';
import { NextFunction, Request, Response } from 'express-serve-static-core';
import { ILogger } from '@rafterjs/logger-plugin';

export default function corsFactory(logger: ILogger, config: CorsOptions = {}) {
  return (req: Request, res: Response, next: NextFunction): void => {
    logger.debug(`    CORS middleware`);
    cors(config)(req, res, next);
  };
}
