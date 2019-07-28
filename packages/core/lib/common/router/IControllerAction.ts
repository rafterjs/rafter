import { Request, Response } from 'express';

export interface IController {
  [action: string]: IControllerAction;
}

export type IControllerAction = (request: Request, response: Response) => void;
