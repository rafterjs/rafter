export type TestConfig2 = {
  bar: string;
  foo: string;
};

export const config2 = (): TestConfig2 => {
  return {
    bar: 'bar not overridden',
    foo: 'foo not overridden',
  };
};

export default config2;
