const fixtureDir = `${__dirname}/../test`;

const servicesConfig = {
  config: {
    path: `${fixtureDir}/fixtures/test-config`,
    dependencies: [],
  },
  testClass: {
    path: `${fixtureDir}/fixtures/test-class`,
    dependencies: [`config.foo`, `config.foo.bar`, 'testFunction'],
  },
  testFunction: {
    path: `${fixtureDir}/fixtures/test-function`,
    dependencies: [],
  },
};

export default servicesConfig;
