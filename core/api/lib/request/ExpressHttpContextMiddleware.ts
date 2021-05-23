import expressHttpContext from 'express-http-context';
import { IMiddleware } from 'rafter';

export default (): IMiddleware => {
  return expressHttpContext.middleware;
};
