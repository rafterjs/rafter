import { IController, IControllerAction } from '@rafter/core/lib/common/router/IControllerAction';
import { Request, Response } from 'express';

interface IHomeController extends IController {
  index: IControllerAction;
}

export default class HomeController implements IHomeController {
  public index(request: Request, response: Response): void {
    console.log('------home ');
    response.send('yeash');
  }
}
