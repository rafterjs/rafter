import { applySslConfig } from '../lib/utils';
import { IApiConfig } from './IApiConfig';

export const config: IApiConfig = {
  server: {
    port: process.env.RAFTER_API_SERVER_PORT ? parseInt(process.env.RAFTER_API_SERVER_PORT, 10) : 5000,
  },
  logger: {
    level: process.env.RAFTER_API_LOG_LEVEL || 'debug',
  },
};

export const { RAFTER_API_SERVER_KEYSTORE_PATH } = process.env;

export default async (): Promise<IApiConfig> => {
  return applySslConfig(
    config,
    process.env.RAFTER_API_SERVER_SSL,
    process.env.RAFTER_API_SERVER_KEYSTORE_PASSWORD,
    RAFTER_API_SERVER_KEYSTORE_PATH,
  );
};
