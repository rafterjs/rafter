import { NextFunction, Request, Response } from 'express-serve-static-core';
import { ILogger } from '../../di-container';

export default (logger: ILogger) => (req: Request, res: Response, next: NextFunction): void => {
  logger.info('---------I am CORS middleware');
  next();
};
