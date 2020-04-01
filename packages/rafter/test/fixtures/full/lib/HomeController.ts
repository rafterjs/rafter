import { Request, Response } from 'express';
import { IController, IControllerAction } from '../../../../lib/common/router';

interface IHomeController extends IController {
  index: IControllerAction;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
export default class HomeController implements IHomeController {
  // TODO figure out why this is required here
  // eslint-disable-next-line class-methods-use-this
  public index(request: Request, response: Response): void {
    response.send(`
    Hi this is the home controller. 
    We have autoloaded all the routes and services.
       <br>
      <br>
      <a href="/other">Go to another page</a>
       <br>
      <br>
      You can also implement JSON endpoints in exactly the same way as normal pages.
      <a href="/api">See the API</a>
    `);
  }
}
