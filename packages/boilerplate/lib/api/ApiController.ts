import { IController, IControllerAction } from '@rafter/core/lib/common/router/IControllerAction';
import { Request, Response } from 'express';

interface IApiController extends IController {
  index: IControllerAction;
}

export default class ApiController implements IApiController {
  private readonly version: string;

  constructor(version: string) {
    this.version = version;
  }

  public index(request: Request, response: Response): void {
    response.json({
      data: {
        user: {
          firstName: 'Daniel',
          lastName: 'Ricciardo',
          email: 'thehoneybadger@renault.fr',
        },
      },
    });
  }
}
