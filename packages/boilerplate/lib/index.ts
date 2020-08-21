import rafter from 'rafter';
import { join } from 'path';

const run = async (): Promise<void> => {
  const rafterServer = rafter({
    paths: [join(__dirname, `/**/`)],
  });

  return rafterServer.start();
};

run();
