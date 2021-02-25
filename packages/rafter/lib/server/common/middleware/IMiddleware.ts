import { NextFunction } from 'express-serve-static-core';
import { IRequest } from '../request/IRequest';
import { IResponse } from '../response/IResponse';

export type INextFunction = NextFunction;

export type IMiddleware = (request: IRequest, response: IResponse, next: INextFunction) => void;
export type IMiddlewareConfig = string;
export type IMiddlewares = Set<IMiddlewareConfig>;
