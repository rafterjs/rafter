import { IController } from 'rafter';
import { Request, Response } from 'express';
import { HomeControllerConfig } from './config';

type IApiController = IController;

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
