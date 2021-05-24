module.exports = {
  preset: 'ts-jest',
  testPathIgnorePatterns: ['dist', 'node_modules'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['lib/**/*.ts'],
  coverageReporters: ['lcov', 'text', 'text-summary'],
};
