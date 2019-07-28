import { NextFunction, Request, Response } from 'express-serve-static-core';

export type IMiddleware = (req: Request, res: Response, next: NextFunction) => void;
export type IMiddlewareConfig = string;
