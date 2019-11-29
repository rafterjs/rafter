import { CameraState, JsIrSdk } from 'node-irsdk';
import { CameraGroupNumber, CameraNumber } from './CameraConstants';

export interface ICameraControlDao {
  hideUi(): void;
}

export default class CameraControlDao implements ICameraControlDao {
  private readonly irsdk: JsIrSdk;

  constructor(irsdk: JsIrSdk) {
    this.irsdk = irsdk;
  }

  public hideUi(): void {
    this.irsdk.camControls.setState(CameraState.UIHidden);
  }

  public switchToCar(
    carNumber: string,
    cameraGroupNumber?: CameraGroupNumber,
    cameraNumber?: CameraNumber,
  ): void {
    this.irsdk.camControls.switchToCar(
      carNumber,
      cameraGroupNumber,
      cameraNumber
    );
  }

  public switchToPosition(
    carNumber: string,
    cameraGroupNumber?: CameraGroupNumber,
    cameraNumber?: CameraNumber,
  ): void {
    this.irsdk.camControls.switchToPos(
      carNumber,
      cameraGroupNumber,
      cameraNumber
    );
  }
}
