import { ParsedQs } from 'qs';
import { NextFunction } from '../../vendor';
import { IParamsDictionary, IRequest } from '../request';
import { IResponse } from '../response';

export type INextFunction = NextFunction;

export interface IMiddleware<
  P = IParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs,
  Locals extends Record<string, any> = Record<string, any>,
> {
  (req: IRequest<P, ResBody, ReqBody, ReqQuery, Locals>, res: IResponse<ResBody, Locals>, next: NextFunction): void;
}

export type IMiddlewareConfig = string;
export type IMiddlewares = Set<IMiddlewareConfig>;
