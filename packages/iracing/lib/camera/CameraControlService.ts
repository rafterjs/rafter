import { JsIrSdk } from 'node-irsdk';
import { CameraGroupNumber, CameraNumber } from './CameraConstants';

export interface ICameraControlService {
  hideUi(): void;
}

export default class CameraControlService implements ICameraControlService {
  private readonly irsdk: JsIrSdk;

  constructor(irsdk: JsIrSdk) {
    this.irsdk = irsdk;
  }

  public hideUi(): void {
    this.irsdk.camControls.setState(this.irsdk.Consts.CameraState.UIHidden);
  }

  public switchToCar(carNumber: string, cameraGroupNumber?: CameraGroupNumber, cameraNumber?: CameraNumber): void {
    this.irsdk.camControls.switchToCar(carNumber, cameraGroupNumber, cameraNumber);
  }

  public switchToPosition(carNumber: string, cameraGroupNumber?: CameraGroupNumber, cameraNumber?: CameraNumber): void {
    this.irsdk.camControls.switchToPos(carNumber, cameraGroupNumber, cameraNumber);
  }
}
