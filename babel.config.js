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
  '@babel/plugin-proposal-object-rest-spread',
  '@babel/plugin-syntax-dynamic-import',
  // '@babel/plugin-syntax-import-meta',
  '@babel/plugin-proposal-class-properties',
  '@babel/plugin-proposal-json-strings'
];

module.exports = { presets, plugins };
