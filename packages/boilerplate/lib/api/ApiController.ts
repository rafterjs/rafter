import { IController } from '@rafter/core/lib/common/router/IControllerAction';
import { Request, Response } from 'express';

interface IApiController extends IController {
  index: (request: Request, response: Response) => void;
}

// @ts-ignore
export default class ApiController implements IApiController {
  private readonly version: string;

  constructor(version: string) {
    this.version = version;
  }

  // TODO figure out why this is required here
  // eslint-disable-next-line class-methods-use-this
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
