#!/usr/bin/env node
import loggerFactory, { LogLevel } from '@rafterjs/logger-plugin';
import yargs from 'yargs/yargs';
import { Watcher, WatcherConfig } from './lib/Watcher';
import { DEFAULT_COMMANDS, DEFAULT_DELAY, DEFAULT_EXTENSION, DEFAULT_IGNORE } from './lib/WatcherConstants';

const { argv } = yargs(process.argv.slice(2)).options({
  restart: { type: 'string', alias: 'r' },
  update: { type: 'string', alias: 'u' },
  ext: { type: 'string', alias: 'e' },
  ignore: { type: 'array', alias: 'i' },
  delay: { type: 'number', alias: 'd' },
});

const config: WatcherConfig = {
  onRestart: argv.restart || DEFAULT_COMMANDS.START,
  onUpdate: argv.update || DEFAULT_COMMANDS.BUILD,
  options: {
    extension: argv.ext || DEFAULT_EXTENSION,
    ignore: argv.ignore || DEFAULT_IGNORE,
    delay: argv.delay || DEFAULT_DELAY,
  },
};
const logger = loggerFactory({ logger: { level: LogLevel.DEBUG } });

logger.info(`Starting Rafter Watcher with the config`, config);
const watcher = new Watcher(config, logger);

async function run() {
  await watcher.start();
}

run();
