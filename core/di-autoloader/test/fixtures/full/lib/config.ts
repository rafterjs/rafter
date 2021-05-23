export type TestConfig1 = {
  bar: string;
};

export const config1 = (): TestConfig1 => {
  return {
    bar: 'bar 1',
  };
};

export default config1;
