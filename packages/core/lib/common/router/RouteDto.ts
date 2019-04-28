/**
 * @param {string} method
 * @param {string} endpoint
 * @param {IControllerAction} controller
 * @return {RouteDto}
 */
import { IControllerAction } from './IControllerAction';

export default class RouteDto {
  method: string;
  endpoint: string;
  controller: IControllerAction;

  constructor(method: string, endpoint: string, controller: IControllerAction) {
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
  public getMethod(): string {
    return this.method;
  }
}
