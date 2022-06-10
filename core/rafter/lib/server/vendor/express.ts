import express, { Express, Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { ParamsDictionary, Query as RequestQuery } from 'express-serve-static-core';

export type { ParamsDictionary, RequestQuery };

export type Request<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = RequestQuery,
  Locals extends Record<string, any> = Record<string, any>,
> = ExpressRequest<P, ResBody, ReqBody, ReqQuery, Locals>;

export type Response<ResBody = any, Locals extends Record<string, any> = Record<string, any>> = ExpressResponse<
  ResBody,
  Locals
>;

export default (): Express => {
  return express();
};
