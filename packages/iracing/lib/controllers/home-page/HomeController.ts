import { Request, Response } from 'express';
import { ICameraControlService } from '../../daos/CameraControlService';

export default class HomeController {
  private readonly cameraControlService: ICameraControlService;

  constructor(cameraControlService: ICameraControlService) {
    this.cameraControlService = cameraControlService;
  }

  public index(request: Request, response: Response): void {
    this.cameraControlService.hideUi();
    response.send(`yoyo`);
  }
}
