import { ILogger } from '@rafterjs/logger-plugin';
import { IPreStartHook } from '../../../../lib/common/pre-start-hooks';

export default function messageOfTheDay(logger: ILogger): IPreStartHook {
  return async function motd(): Promise<void> {
    logger.debug('This is the message of the day');
  };
}
