import { Request, Response } from 'express';

export interface IController {
  index: IControllerAction;
}

export type IControllerAction = (request: Request, response: Response) => void;
