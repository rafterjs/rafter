import * as express from 'express';
import RouterProvider from './RouterProvider';

/**
 * @return {RouterProvider}
 */
export default (): RouterProvider => {
  return new RouterProvider(express);
};
