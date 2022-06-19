import { Request, ParamsDictionary, RequestQuery } from '../../vendor';

export type IRequest<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = RequestQuery,
  Locals extends Record<string, any> = Record<string, any>,
> = Request<P, ResBody, ReqBody, ReqQuery, Locals>;
