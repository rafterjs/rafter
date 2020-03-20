import Rafter from './rafter';
import { IRafterOptions } from './IRafterOptions';

/*
* Paths
*
* - Core
* - Plugins
* - Application
* */
export default ({ logger }: IRafterOptions): Rafter => {
  return new Rafter({
    logger,
    paths: [`${__dirname}/../*.ts`],
  });
};

export { Rafter };
