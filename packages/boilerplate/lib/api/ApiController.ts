import { IController } from 'rafter/lib/common/router/IControllerAction';
import { Request, Response } from 'express';
import { HomeControllerConfig } from './config';

interface IApiController extends IController {
  index(request: Request, response: Response): void;
}

export default class ApiController implements IApiController {
  constructor(private readonly config: HomeControllerConfig) {}

  public index(request: Request, response: Response): void {
    response.json({
      data: {
        controller: this.config.controller.home,
        user: {
          firstName: 'Daniel',
          lastName: 'Ricciardo',
          email: 'thehoneybadger@renault.fr',
        },
      },
    });
  }
}
