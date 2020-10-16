export default {
  rafter: {
    onRestart: 'yarn build && yarn start',
    onChange: 'yarn build',
    include: ['**/*.ts'],
    exclude: ['dist', 'node_modules'],
  },
};
