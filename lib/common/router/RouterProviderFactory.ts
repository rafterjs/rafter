import * as express from 'express';
import RouterProvider from './RouterProvider';

/**
 * @return {RouterProvider}
 */
export default () => {
  return new RouterProvider(express);
};
