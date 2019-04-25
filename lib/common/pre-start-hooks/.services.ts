export default {
  preStartHooksProvider: {
    path: `${__dirname}/PreStartHooksProvider`,
    dependencies: [`diContainer`, `logger`],
  },
};
