import { IServerConfig } from '../../../../lib';

export type TestConfig = IServerConfig & {
  bar: string;
};

export default (): TestConfig => ({
  bar: 'test something 2',
  server: {
    port: 2009,
  },
});
