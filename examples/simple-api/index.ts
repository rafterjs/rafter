import { Server } from '@rafterjs/api';
import { join } from 'path';

const appPaths = [join(__dirname, `{lib,config}/**/`)];
const server = new Server(appPaths);

async function run(): Promise<void> {
  try {
    await server.start();
  } catch (error) {
    console.error(error);
    await server.stop();
    process.exit(1);
  }
}

run();
