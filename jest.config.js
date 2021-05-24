console.log('------------------ HI');
console.log(process.env.NPM_TOKEN);

module.exports = {
  preset: 'ts-jest',
  testPathIgnorePatterns: ['dist', 'node_modules'],
};
