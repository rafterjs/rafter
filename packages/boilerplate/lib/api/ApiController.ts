import { IController } from 'rafter/lib/common/router/IControllerAction';
import { Request, Response } from 'express';
import { HomeControllerConfig } from './config';

interface IApiController extends IController {
  index(request: Request, response: Response): void;
}

export default class ApiController {
  private readonly config: HomeControllerConfig;

  constructor(config: HomeControllerConfig) {
    this.config = config;
  }

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
