import { IRafterConfig } from '../../../../lib/config/IRafterConfig';

export type TestConfig = IRafterConfig & {
  bar: string;
};

export default (): TestConfig => ({
  bar: 'test something',
  server: {
    port: 2009,
  },
});
