import { join } from 'path';
import { Server } from '../lib/Server';

const appPaths = [join(__dirname, `/../example/**/`)];
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
