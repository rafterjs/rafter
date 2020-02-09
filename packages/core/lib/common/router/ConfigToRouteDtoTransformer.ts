import { IDiAutoloader } from '@rafter/di-autoloader';
import RouteDto from './RouteDto';
import { METHODS } from './RouteMethodConstants';
import { ITransformer } from '../mappers/ITransformer';
import { IRouteConfig } from './IRouteConfig';
import { IController, IControllerAction } from './IControllerAction';

/**
 * A config to route mapper.
 *
 * @param {IDiAutoloader} diContainer
 * @return {ConfigToRouteDtoTransformer}
 */
export default class ConfigToRouteDtoTransformer implements ITransformer<IRouteConfig[], RouteDto[]> {
  private readonly diAutoloader: IDiAutoloader;

  constructor(diContainer: IDiAutoloader) {
    this.diAutoloader = diContainer;
  }

  /**
   *
   * @param {String} controllerName
   * @param {String} action
   * @returns {Function}
   * @private
   */
  private getControllerAction(controllerName: string, action: string): IControllerAction {
    const controller = this.diAutoloader.get<IController>(controllerName);
    if (!controller[action]) {
      throw new Error(`Could not register the controller ${controllerName} with the action ${action}`);
    }

    return controller[action].bind(controller);
  }

  /**
   * @param {string=} method
   * @param {string} endpoint
   * @param {string} controller
   * @param {string} action
   * @return {RouteDto}
   * @private
   */
  private convertSingle({ method = METHODS.get, endpoint, controller, action }: IRouteConfig): RouteDto {
    return new RouteDto(method, endpoint, this.getControllerAction(controller, action));
  }

  /**
   * @param {IRouteConfig[]} source
   * @return {RouteDto[]}
   */
  public convert(source: IRouteConfig[]): RouteDto[] {
    const routes: RouteDto[] = [];

    Object.values(source).forEach((config: IRouteConfig): void => {
      routes.push(this.convertSingle(config));
    });

    return routes;
  }
}
