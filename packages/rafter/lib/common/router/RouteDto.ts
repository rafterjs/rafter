/**
 * @param {string} method
 * @param {string} endpoint
 * @param {IControllerAction} controller
 * @return {RouteDto}
 */
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

  /**
   * @return {string}
   */
  public getEndpoint(): string {
    return this.endpoint;
  }

  /**
   * @return {IControllerAction}
   */
  public getController(): IControllerAction {
    return this.controller;
  }

  /**
   * @return {string}
   */
  public getMethod(): MethodActions {
    return this.method;
  }
}
