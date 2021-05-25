import { ILoggerConfig } from '@rafterjs/logger-plugin';
import { IServerConfig } from '../../../../lib';

export type TestConfig = IServerConfig &
  ILoggerConfig & {
    bar: string;
  };

export default (): TestConfig => ({
  logger: {
    level: 'info',
  },
  bar: 'test something',
  server: {
    port: 9999,
  },
});
