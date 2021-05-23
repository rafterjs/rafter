import { ILambdaConfig } from '@rafterjs/lambda';
import { config } from '@rafterjs/logger-plugin';
import { IMessageDto } from '../lib/MessageDto';

export type ISimpleExampleLambdaConfig = ILambdaConfig & {
  example: {
    messages: IMessageDto[];
  };
};

export default async (): Promise<ISimpleExampleLambdaConfig> => {
  return {
    logger: {
      ...config.logger,
    },
    example: {
      messages: [
        {
          quote: "I never want to change so much that people can't recognize me",
          author: 'Taylor Swift',
        },
        {
          quote: 'We are the cosmos made conscious and life is the means by which the universe understands itself.',
          author: 'Brian Cox',
        },
        {
          quote: "I don't want anyone to hold back who they are. It's not okay... it's not a good thing",
          author: 'Connor Franta',
        },
        {
          quote:
            'Everybody is special. Everybody. Everybody is a hero, a lover, a fool, a villain. Everybody.' +
            ' Everybody has their story to tell.',
          author: 'Alan Moore, V for Vendetta',
        },
        {
          quote:
            "Being happy doesn't mean that everything is perfect. It means that you've decided to look " +
            'beyond the imperfections.',
          author: 'Gerard Way',
        },
      ],
    },
  };
};
