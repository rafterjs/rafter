export type TestConfig = {
  bar: string;
};

export default (): TestConfig => ({
  bar: 'test something',
});
