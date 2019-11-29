import * as irsdk from 'node-irsdk';

export default ({ telemetryUpdateInterval = 100 }) => {
  irsdk.init({ telemetryUpdateInterval });
  return irsdk.getInstance();
};
