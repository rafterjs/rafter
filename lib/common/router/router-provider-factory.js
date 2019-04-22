import express from 'express';
import RouterProvider from './router-provider';

/**
 * @return {RouterProvider}
 */
export default () => {
  return RouterProvider(express);
};
