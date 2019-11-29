import { IController, IControllerAction } from '@rafter/core/dist/lib/common/router/IControllerAction';
import { Request, Response } from 'express';
import { ICameraControlDao } from '../../daos/CameraControlDao';

interface IHomeController extends IController {
  index: IControllerAction;
}

export default class HomeController implements IHomeController {
  private readonly cameraControlDao: ICameraControlDao;

  constructor(cameraControlDao: ICameraControlDao) {
    this.cameraControlDao = cameraControlDao;
  }

  public index(request: Request, response: Response): void {
    this.cameraControlDao.hideUi();
    response.send(`yoyo`);
  }
}
