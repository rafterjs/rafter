import { join } from 'path';
import { applySslConfig } from '../lib/utils/ConfigHelper';
import { IApiConfig } from './IApiConfig';

export const config: IApiConfig = {
  server: {
    port: process.env.AEMO_API_SERVER_PORT ? parseInt(process.env.AEMO_API_SERVER_PORT, 10) : 5000,
  },
  logger: {
    level: process.env.AEMO_API_LOG_LEVEL || 'debug',
  },
};

export const AEMO_API_SERVER_KEYSTORE_PATH =
  process.env.AEMO_API_SERVER_KEYSTORE_PATH || join(__dirname, '../keystore/aemo_cdp_api.p12');

export default async (): Promise<IApiConfig> => {
  return applySslConfig(
    config,
    process.env.AEMO_API_SERVER_SSL,
    process.env.AEMO_API_SERVER_KEYSTORE_PASSWORD,
    AEMO_API_SERVER_KEYSTORE_PATH,
  );
};
