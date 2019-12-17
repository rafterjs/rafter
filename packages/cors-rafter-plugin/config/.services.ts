export default {
  cors: {
    path: `${__dirname}/../cors`,
    dependencies: ['config.cors', 'logger'],
  },
};
