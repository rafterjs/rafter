import { NextFunction, Request, Response } from 'express-serve-static-core';

export type IRequest = Request;
export type IResponse = Response;
export type INextFunction = NextFunction;

export type IMiddleware = (request: IRequest, response: IResponse, next: INextFunction) => void;
export type IMiddlewareConfig = string;
export type IMiddlewares = Set<IMiddlewareConfig>;
