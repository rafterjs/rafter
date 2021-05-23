import { Server } from '@rafterjs/api';
import { logger } from '@rafterjs/logger-plugin';
import { join } from 'path';

const paths = [join(__dirname, `{lib,config}/**/`)];
const server = new Server({ paths });

async function run(): Promise<void> {
  try {
    logger.info(`Starting the simple rafter api`);
    await server.start();
  } catch (error) {
    logger.error(error);
    await server.stop();
    process.exit(1);
  }
}

run();
