import { IController, IControllerAction } from '@rafter/core/lib/common/router/IControllerAction';
import { Request, Response } from 'express';

interface IOtherController extends IController {
  index: IControllerAction;
}
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
export default class OtherController implements IOtherController {
  private readonly message: string;

  constructor(message: string) {
    this.message = message;
  }

  public index(request: Request, response: Response): void {
    response.send(
      `
      Config drives all the things. It is accessible via "config.key.otherkey": ${this.message}
      <br>
      <br>
      <a href="/">Go back to home</a>
      `,
    );
  }
}
