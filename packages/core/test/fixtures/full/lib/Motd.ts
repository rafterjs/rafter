import { ILogger } from '@rafter/utils';
import { IPreStartHook } from '../../../../lib/common/pre-start-hooks';

export default function (logger: ILogger): IPreStartHook {
  return async function motd(): Promise<void> {
    logger.debug('This is the message of the day');
  };
}
