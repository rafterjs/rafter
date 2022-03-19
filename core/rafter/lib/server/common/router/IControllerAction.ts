import { IRequest } from '../request';
import { IResponse } from '../response';

export type IControllerAction = (request: IRequest, response: IResponse) => void;

// TODO, figure out how to do a dynamic method name with the IControllerAction signature
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IController {}
