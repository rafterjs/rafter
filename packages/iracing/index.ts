import rafter from '@rafter/core';

const run = async (): Promise<void> => {
  const rafterServer = rafter({
    applicationPaths: __dirname,
    corePaths: __dirname,
    logger: console,
  });
  await rafterServer.start();
};

run();
