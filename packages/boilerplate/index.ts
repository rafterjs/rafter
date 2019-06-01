import rafter from '@rafter/core';

const run = async (): Promise<void> => {
  const rafterServer = rafter({
    appDirectory: `${__dirname}`,
    logger: console,
  });
  await rafterServer.start();
};

run();
