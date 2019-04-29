const presets = [
  [
    '@babel/env',
    {
      targets: {
        node: '9',
      },
    },
  ],
];

const plugins = [
  '@babel/plugin-proposal-class-properties',
  '@babel/plugin-proposal-object-rest-spread',
  '@babel/plugin-syntax-dynamic-import'
];

module.exports = { presets, plugins };
