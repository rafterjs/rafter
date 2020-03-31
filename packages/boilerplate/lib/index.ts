import rafter from '@rafter/core';
import { join } from 'path';

const run = async (): Promise<void> => {
  const rafterServer = rafter({
    paths: [join(__dirname, '/**/!(*.spec).@(ts|js)')],
    logger: console,
  });

  return rafterServer.start().catch((error: Error): void => {
    console.error(`Failed to start rafter`, error);
  });
};

run();
