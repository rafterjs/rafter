import { JsIrSdkConfig, init, getInstance, JsIrSdk } from 'node-irsdk';

export default ({ telemetryUpdateInterval = 100, sessionInfoUpdateInterval }: JsIrSdkConfig): JsIrSdk => {
  init({ telemetryUpdateInterval, sessionInfoUpdateInterval });
  const iracing = getInstance();
  // iracing.on('SessionInfo', (evt) => {
  //   console.log('-------------SessionInfo', evt);
  // });

  return iracing;
};
