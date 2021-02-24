import { IDiAutoloader } from '@rafterjs/di-autoloader';
import { ITransformer } from '../mappers';
import { IController, IControllerAction } from './IControllerAction';
import { IRouteConfig, IRoutes } from './IRouteConfig';
import { RouteDto } from './RouteDto';
import { METHODS } from './RouteMethodConstants';

/**
 * A config to route mapper.
 */
export class ConfigToRouteDtoTransformer implements ITransformer<IRoutes, RouteDto[]> {
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

  public convert(source: IRoutes): RouteDto[] {
    const routes: RouteDto[] = [];

    for (const config of source) {
      routes.push(this.convertSingle(config));
    }

    return routes;
  }
}

export default ConfigToRouteDtoTransformer;
