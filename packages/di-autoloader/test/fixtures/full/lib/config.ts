export type TestConfig1 = {
  bar: string;
};

const mergedConfig = (): TestConfig1 => {
  return {
    bar: 'bar overridden',
  };
};

export default mergedConfig;
