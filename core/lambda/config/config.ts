import { ILambdaConfig } from './ILambdaConfig';

export const config: ILambdaConfig = {
  logger: {
    level: process.env.RAFTER_API_LOG_LEVEL || 'debug',
  },
};
