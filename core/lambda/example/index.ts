import { join } from 'path';
import { ILogger } from '@rafterjs/logger-plugin';
import { rafterLambda } from '../lib/RafterLambda';
import { SomeOtherDependency } from './lib/SomeOtherDependency';

const paths = [join(__dirname, `/../example/**/`)];

async function run(): Promise<void> {
  await rafterLambda(
    { paths },
    (myLambdaDependency: () => void, someOtherDependency: SomeOtherDependency, logger: ILogger) => () => {
      // execute the function dependency
      myLambdaDependency();

      // use the logger dep
      logger.info(`We can do other cool shit here too.`);

      // call a class dependency
      logger.warn(someOtherDependency.getStuff());
    },
  );
}

run();
