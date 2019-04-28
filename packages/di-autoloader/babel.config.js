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

const plugins = ['@babel/plugin-proposal-object-rest-spread'];

module.exports = { presets, plugins };
