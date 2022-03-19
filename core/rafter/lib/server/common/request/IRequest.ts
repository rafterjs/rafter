import { ParsedQs } from 'qs';
import { Request } from '../../vendor';

export interface IParamsDictionary {
  [key: string]: string;
}
export type IRequest<
  P = IParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs,
  Locals extends Record<string, any> = Record<string, any>,
> = Request<P, ResBody, ReqBody, ReqQuery, Locals>;
