export interface ICameraControlDao {
  hideUi(): void;
}

export default class CameraControlDao implements ICameraControlDao {
  private readonly irsdk: object;

  constructor(irsdk: object) {
    this.irsdk = irsdk;
  }

  public hideUi(): void {
    const States = this.irsdk.Consts.CameraState;
    this.irsdk.camControls.setState(States.UIHidden);
  }
}
