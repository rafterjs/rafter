import { JsIrSdkConfig, init, getInstance, JsIrSdk } from 'node-irsdk';

export default ({ telemetryUpdateInterval = 100 }: JsIrSdkConfig): JsIrSdk => {
  init({ telemetryUpdateInterval });
  return getInstance();
};
