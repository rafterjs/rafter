import * as irsdk from 'node-irsdk';
import { JsIrSdkConfig } from 'node-irsdk';

export default ({ telemetryUpdateInterval = 100 }: JsIrSdkConfig) => {
  irsdk.init({ telemetryUpdateInterval });
  return irsdk.getInstance();
};
