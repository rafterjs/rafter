import { IDiAutoloader } from '@rafterjs/di-autoloader';
import RouteDto from './RouteDto';
import { METHODS } from './RouteMethodConstants';
import { ITransformer } from '../mappers';
import { IRouteConfig } from './IRouteConfig';
import { IController, IControllerAction } from './IControllerAction';

/**
 * A config to route mapper.
 */
export default class ConfigToRouteDtoTransformer implements ITransformer<IRouteConfig[], RouteDto[]> {
  constructor(private readonly diAutoloader: IDiAutoloader) {}

  private getControllerAction(controllerName: string, action: string): IControllerAction {
    const controller = this.diAutoloader.get<IController>(controllerName);
    const methods = Object.keys(controller);

    if (methods.includes(action)) {
      throw new Error(`Could not register the controller ${controllerName} with the action ${action}`);
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return controller[action].bind(controller);
  }

  private convertSingle({ method = METHODS.get, endpoint, controller, action }: IRouteConfig): RouteDto {
    return new RouteDto(method, endpoint, this.getControllerAction(controller, action));
  }

  public convert(source: IRouteConfig[]): RouteDto[] {
    const routes: RouteDto[] = [];

    Object.values(source).forEach((config: IRouteConfig): void => {
      routes.push(this.convertSingle(config));
    });

    return routes;
  }
}
