import { IServerConfig } from '../../../../lib/server/config/IServerConfig';

export type TestConfig = IServerConfig & {
  bar: string;
};

export default (): TestConfig => ({
  bar: 'test something',
  server: {
    port: 2009,
  },
});
