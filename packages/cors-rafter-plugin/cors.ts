import { ILogger } from '@rafter/utils';
import cors, { CorsOptions } from 'cors';
import { NextFunction, Request, Response } from 'express-serve-static-core';

export default (options: CorsOptions = {}, logger: ILogger) => (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  logger.debug(`CORS middleware`, options);
  cors(options)(req, res, next);
};
