import { NextFunction, Request, Response } from 'express-serve-static-core';

export default (req: Request, res: Response, next: NextFunction) => {
  console.log('----here is tge cors');
  next();
};
