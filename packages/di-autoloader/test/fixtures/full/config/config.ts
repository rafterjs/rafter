export type TestConfig2 = {
  bar: string;
  foo: string;
};

const mergedConfig = (): TestConfig2 => {
  return {
    bar: 'bar not overridden',
    foo: 'foo not overridden',
  };
};

export default mergedConfig;
