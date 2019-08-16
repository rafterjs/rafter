module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: false,
    node: true,
    jest: true,
  },
  extends: ['airbnb-base', 'prettier'],
  rules: {
    'class-methods-use-this': 'off',
    'no-underscore-dangle': ['error', { allowAfterThis: true }],
    'max-len': ['error', { code: 120, tabWidth: 2 }],
  },
};
