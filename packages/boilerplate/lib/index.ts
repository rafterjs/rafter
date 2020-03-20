import rafterFactory from '@rafter/core';

console.log('---------------- loading rafter');
const run = async (): Promise<void> => {
  const rafterServer = rafterFactory({
    appDirectory: `${__dirname}`,
    logger: console,
  }); 
  console.log('---------------- starting rafter');
  return rafterServer.start().catch((error: Error): void => {
    console.error(`Failed to start rafter`, error);
  });
};

run();
