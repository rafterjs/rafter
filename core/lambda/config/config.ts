import { IApiConfig } from './IApiConfig';

export const config: IApiConfig = {
  logger: {
    level: process.env.AEMO_API_LOG_LEVEL || 'debug',
  },
};
