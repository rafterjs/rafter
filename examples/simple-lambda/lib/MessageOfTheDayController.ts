import { ILogger } from '@rafterjs/logger-plugin';
import * as process from 'process';
import { MessageOfTheDayDao } from './MessageOfTheDayDao';
import { MessageOfTheDayPrompt } from './MessageOfTheDayPrompt';

export const messageOfTheDayController =
  (messageOfTheDayDao: MessageOfTheDayDao, messageOfTheDayPrompt: MessageOfTheDayPrompt, logger: ILogger) =>
  async (): Promise<void> => {
    logger.info(`

___  ________ ___________ 
|  \\/  |  _  |_   _|  _  \\
| .  . | | | | | | | | | |
| |\\/| | | | | | | | | | |
| |  | \\ \\_/ / | | | |/ / 
\\_|  |_/\\___/  \\_/ |___/  

`);

    async function showMessage() {
      const message = await messageOfTheDayDao.getMotd();

      logger.info(`
      "${message.quote}"
        -- ${message.author}
        
      `);

      // ensure the question is in the next tick
      process.nextTick(async () => {
        if (messageOfTheDayPrompt.prompt()) {
          showMessage();
        } else {
          process.exit(0);
        }
      });
    }

    showMessage();
  };
