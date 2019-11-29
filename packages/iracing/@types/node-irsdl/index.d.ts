declare module 'node-irsdk' {
  export function getInstance(): JsIrSdk;

  export function init(config?: JsIrSdkConfig): void;

  export interface JsIrSdk {
    camControls: CameraControls;
  }

  export type JsIrSdkConfig = {
    telemetryUpdateInterval?: number;
    sessionInfoUpdateInterval?: number;
  };

  export enum CameraState {
    IsSessionScreen = '0x0001',
    IsScenicActive = '0x0002',
    UIHidden = '0x0008',
    CamToolActive = '0x0004',
    UseAutoShotSelection = '0x0010',
    UseTemporaryEdits = '0x0020',
    UseKeyAcceleration = '0x0040',
    UseKey10xAcceleration = '0x0080',
    UseMouseAimMode = '0x0100',
  }

  export enum CameraFocus {
    Incident = -3,
    Leader = -2,
    Exciting = -1,
    Driver = 0,
  }

  export interface CameraControls {
    setState: (state: CameraState) => void;

    switchToCar: (carNumber: string | number, cameraGroupNumber?: number, cameraNumber?: number) => void;

    switchToPos: (carNumber: string | number, cameraGroupNumber?: number, cameraNumber?: number) => void;
  }
}
