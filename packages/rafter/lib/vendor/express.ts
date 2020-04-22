import express, { Express, Request as ExpressRequest, Response as ExpressResponse } from 'express';

export type Request = ExpressRequest;
export type Response = ExpressResponse;

export default (): Express => {
  return express();
};
