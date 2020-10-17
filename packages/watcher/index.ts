import loggerFactory, { LogLevel } from '@rafterjs/logger-plugin';
import { Watcher } from './lib/Watcher';

const config = {};

// get dependencies
const dependencies = `lerna list --scope @rafterjs/boilerplate --include-dependencies`;

const watcher = new Watcher(config, loggerFactory({ logger: { level: LogLevel.DEBUG } }));

async function run() {
  await watcher.start();
}

run();
