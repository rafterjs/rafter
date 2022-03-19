import express, { Express } from 'express';

export { Express, Request, Response, IRouter, Router, NextFunction } from 'express';

export default (): Express => {
  return express();
};
