import Rafter from '../packages/core/lib';

const run = async () => {
  const rafter = Rafter({
    appDirectory: `${__dirname}`,
    logger: console,
  });
  await rafter.start();
};

run();
