import { join } from 'path';
import { rafterLambda } from '@rafterjs/lambda';
import { messageOfTheDayController } from './lib/MessageOfTheDayController';

const paths = [join(__dirname, `/{lib,config}/**/`)];

/**
 * This is an example function that benefits from rafter auto dependency injection.
 * This means that you can reuse all the services and code you have written for an API or other apps within a
 * cron job, CLI app or serverless app.
 */
async function run(): Promise<void> {
  await rafterLambda({ paths }, messageOfTheDayController);
}

run();
