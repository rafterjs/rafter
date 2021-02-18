import { IControllerAction } from './IControllerAction';
import { MethodActions } from './RouteMethodConstants';

export default class RouteDto {
  constructor(
    private readonly method: MethodActions,
    private readonly endpoint: string,
    private readonly controller: IControllerAction,
  ) {}

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
