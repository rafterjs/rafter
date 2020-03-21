import rafter from '@rafter/core';

console.log('---------------- loading rafter');
const run = async (): Promise<void> => {
  const rafterServer = rafter({
    corePaths: 'sda',
    applicationPaths: __dirname,
    logger: console,
  });

  console.log('---------------- starting rafter', rafterServer);

  return rafterServer.start().catch((error: Error): void => {
    console.error(`Failed to start rafter`, error);
  });
};

run();
