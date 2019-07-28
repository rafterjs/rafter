import * as Express from 'express';
import { IRouter } from 'express-serve-static-core';

export interface IRouterProvider {
  createInstance(): IRouter;
}

/**
 * A provider that creates new router instances
 */
export default class RouterProvider implements IRouterProvider {
  private readonly routerFactory: typeof Express.Router;

  constructor(express: typeof Express) {
    this.routerFactory = express.Router;
  }

  public createInstance(): IRouter {
    return this.routerFactory();
  }
}
