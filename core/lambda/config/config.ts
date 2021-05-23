import { ILambdaConfig } from './ILambdaConfig';

export const config: ILambdaConfig = {
  logger: {
    level: process.env.AEMO_API_LOG_LEVEL || 'debug',
  },
};
