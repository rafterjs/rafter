import { Request, Response } from 'express';
import { ICameraControlService } from '../../camera/CameraControlService';
import SessionDao from '../../session/SessionDao';

export default class HomeController {
  private readonly cameraControlService: ICameraControlService;

  private readonly sessionDao: SessionDao;

  constructor(cameraControlService: ICameraControlService, sessionDao: SessionDao) {
    this.cameraControlService = cameraControlService;
    this.sessionDao = sessionDao;
  }

  public index(request: Request, response: Response): void {
    // this.cameraControlService.hideUi();
    // this.sessionDao.watchForUpdates();
    // console.log('---------------------1', this.sessionDao.watchForUpdates());

    response.send(`yoyo`);
  }
}
