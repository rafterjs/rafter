import { ILogger } from '@rafterjs/logger-plugin';
import { ISimpleExampleLambdaConfig } from '../config/config';
import { IMessageDto } from './MessageDto';

export class MessageOfTheDayDao {
  constructor(private readonly config: ISimpleExampleLambdaConfig, private readonly logger: ILogger) {}

  public getMotd(): IMessageDto {
    const { messages } = this.config.example;
    const num = Math.floor(Math.random() * messages.length);
    return messages[num];
  }
}

export default MessageOfTheDayDao;
