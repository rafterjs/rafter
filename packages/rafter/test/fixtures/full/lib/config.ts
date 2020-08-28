import { IRafterServerConfig } from '../../../../lib/config/IRafterServerConfig';

export type TestConfig = IRafterServerConfig & {
  bar: string;
};

export default (): TestConfig => ({
  bar: 'test something',
  server: {
    port: 2009,
  },
});
