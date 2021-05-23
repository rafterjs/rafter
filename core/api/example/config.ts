import { IApiConfig } from '../config';

export type IExampleApiConfig = IApiConfig;
export const config: IExampleApiConfig = {
  server: {
    port: 3000,
  },
  logger: {
    level: 'debug',
  },
};

export default (): IExampleApiConfig => config;
