/**
 * This is just used as a factory wrapper so that console can be accessed from the DI
 */
import { ILogger } from './ILogger';

export default (): ILogger => {
  return console;
};
