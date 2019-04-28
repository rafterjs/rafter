const presets = [
  [
    '@babel/env',
    {
      targets: {
        node: '9'
      }
    }
  ],
  '@babel/preset-typescript'
];

const plugins = [
  '@babel/plugin-proposal-class-properties',
  '@babel/plugin-proposal-object-rest-spread'
];

module.exports = { presets, plugins };
