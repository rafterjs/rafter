export type TestConfig2 = {
  bar: string;
  foo: string;
};

export const config2 = (): TestConfig2 => {
  return {
    bar: 'bar 2',
    foo: 'foo 1',
  };
};

export default config2;
