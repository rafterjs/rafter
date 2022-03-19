import { IRouter, Router } from '../../vendor';

export { IRouter } from '../../vendor';

export interface IRouterProvider {
  createInstance(): IRouter;
}

/**
 * A provider that creates new router instances
 */
export class RouterProvider implements IRouterProvider {
  public createInstance(): IRouter {
    return Router();
  }
}

export default RouterProvider;
