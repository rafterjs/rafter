import { NextFunction, Request, Response } from 'express-serve-static-core';

export type IMiddleWare = (req: Request, res: Response, next: NextFunction) => void;
export type IMiddleWareConfig = string;
