import { ILoggerConfig } from '@rafterjs/logger-plugin';
import { IServerConfig } from 'rafter';

export type IApiConfig = {
  server: {
    port?: number;
  };
} & IServerConfig &
  ILoggerConfig;
