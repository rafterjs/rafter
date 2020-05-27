import { IController } from 'rafter/lib/common/router/IControllerAction';
import { Request, Response } from 'express';
import { BoilerplateConfig } from '../config/config';

type IOtherController = IController;
export default class OtherController implements IOtherController {
  private readonly config: BoilerplateConfig;

  constructor(config: BoilerplateConfig) {
    this.config = config;
  }

  public index(request: Request, response: Response): void {
    response.send(
      `
      Config drives all the things. It is accessible via "config.key.otherkey": ${this.config.message}
      <br>
      <br>
      <a href="/">Go back to home</a>
      `,
    );
  }
}
