declare module 'node-irsdk' {
  export function getInstance(): JsIrSdk;

  export function init(config?: JsIrSdkConfig): void;

  export type JsIrSdkConstants = {
    CameraState: {
      UIHidden: number;
    };
  };

  export interface JsIrSdk {
    Consts: JsIrSdkConstants;
    camControls: CameraControls;
    // TODO add on/emit extends EventEmitter
  }

  export type JsIrSdkConfig = {
    telemetryUpdateInterval?: number;
    sessionInfoUpdateInterval?: number;
  };

  // TODO you cant use enums in types files. Look at how we can handle this.
  export enum CameraState {
    IsSessionScreen = 0x0001,
    IsScenicActive = 0x0002,
    UIHidden = 0x0008,
    CamToolActive = 0x0004,
    UseAutoShotSelection = 0x0010,
    UseTemporaryEdits = 0x0020,
    UseKeyAcceleration = 0x0040,
    UseKey10xAcceleration = 0x0080,
    UseMouseAimMode = 0x0100,
  }

  export enum Actions {
    SessionInfo = 'SessionInfo',
    Telemetry = 'Telemetry',
    TelemetryDescription = 'TelemetryDescription',
    Connected = 'Connected',
    Disconnected = 'Disconnected',
    Update = 'update',
  }

  export enum CameraFocus {
    Incident = -3,
    Leader = -2,
    Exciting = -1,
    Driver = 0,
  }

  export type SessionInfo = {};

  export interface CameraControls {
    setState: (state: CameraState) => void;

    switchToCar: (carNumber: string | number, cameraGroupNumber?: number, cameraNumber?: number) => void;

    switchToPos: (carNumber: string | number, cameraGroupNumber?: number, cameraNumber?: number) => void;
  }
}
