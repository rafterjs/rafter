import { Request, Response } from 'express';

export type IControllerAction = (request: Request, response: Response) => void;

// TODO, figure out how to do a dynamic method name with the IControllerAction signature
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IController {}
