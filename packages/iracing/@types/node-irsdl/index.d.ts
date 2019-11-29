/// <reference types="node" />

declare module 'node-irsdk' {
  export function getInstance(): JsIrSdk;

  export function init(config?: JsIrSdkConfig): void;

  export interface JsIrSdk {
    camControls: CameraControls;
  }

  export type JsIrSdkConfig = {
    telemetryUpdateInterval?: number;
    sessionInfoUpdateInterval?: number;
  }

  export enum CameraState {
    IsSessionScreen = '0x0001',
    IsScenicActive = '0x0002',
    UIHidden = '0x0008',
  }

  export interface CameraControls {
    setState: (state: CameraState) => void;

    switchToCar: (
      carNumber: string | number,
      cameraGroupNumber?:  number,
      cameraNumber?: number,
    ) => void;

    switchToPos: (
      carNumber: string | number,
      cameraGroupNumber?: number,
      cameraNumber?: number,
    ) => void;
  }
}
