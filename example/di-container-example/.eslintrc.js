module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: false,
    node: true
  },
  extends: ['airbnb-base', 'prettier'],
  rules: {
    'no-underscore-dangle': ['error', { allowAfterThis: true }],
    'max-len': ['error', { code: 120, tabWidth: 2 }]
  }
};