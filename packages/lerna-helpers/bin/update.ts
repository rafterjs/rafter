import { loggerFactory, LogLevel } from '@rafterjs/logger-plugin';
import { dependencyUpdatorFactory } from '../lib/dependencies/DependencyUpdator';

const logger = loggerFactory({ logger: { level: LogLevel.DEBUG } });
logger.info('--- WELCOME ---');
logger.debug('--- DEBUG ON ---');
const dependencyUpdator = dependencyUpdatorFactory(logger);

async function run() {
  logger.info('⏳ Starting to update dependencies in all lerna packages');
  await dependencyUpdator.update();
  logger.info('✔ Completed updating dependencies');
}

run();
