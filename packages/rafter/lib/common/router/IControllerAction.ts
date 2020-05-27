import { Request, Response } from 'express';

export interface IController {
  index(request: Request, response: Response): void;
}

export type IControllerAction = (request: Request, response: Response) => void;
