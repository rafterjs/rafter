/**
 * A provider that creates new router instances
 *
 * @param {object} express
 * @return {RouterProvider}
 */
import * as Express from 'express';
import { IRouter } from 'express-serve-static-core';

export default class RouterProvider {
  routerFactory: typeof Express.Router;

  constructor(express: typeof Express) {
    this.routerFactory = express.Router;
  }

  /**
   * Creates a new router instance.
   *
   * @return {IRouter}
   */
  public createInstance(): IRouter {
    return this.routerFactory();
  }
}
