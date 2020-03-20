import rafter from '@rafter/core';

const run = async (): Promise<void> => {
  const rafterServer = rafter({
    appDirectory: `${__dirname}`,
    logger: console,
  });
  return rafterServer.start().catch(error => {
    console.error(`Failed to start rafter`, error);
  });
};

run();
