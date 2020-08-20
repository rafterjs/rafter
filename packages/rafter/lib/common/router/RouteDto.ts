import { IControllerAction } from './IControllerAction';
import { MethodActions } from './RouteMethodConstants';

export default class RouteDto {
  private readonly method: MethodActions;

  private readonly endpoint: string;

  private readonly controller: IControllerAction;

  constructor(method: MethodActions, endpoint: string, controller: IControllerAction) {
    this.method = method;
    this.endpoint = endpoint;
    this.controller = controller;
  }

  public getEndpoint(): string {
    return this.endpoint;
  }

  public getController(): IControllerAction {
    return this.controller;
  }

  public getMethod(): MethodActions {
    return this.method;
  }
}
