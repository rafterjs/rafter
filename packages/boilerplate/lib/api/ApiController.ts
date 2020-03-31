import { IController } from '@rafter/core/lib/common/router/IControllerAction';
import { Request, Response } from 'express';
import { BoilerplateConfig } from '../config/config';

interface IApiController extends IController {
  index: (request: Request, response: Response) => void;
}

export default class ApiController {
  private readonly config: BoilerplateConfig;

  constructor(config: BoilerplateConfig) {
    this.config = config;
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
