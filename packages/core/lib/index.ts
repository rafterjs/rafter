import { join } from 'path';
import Rafter, { RafterConfig } from './Rafter';
import { IRafterOptions } from './IRafterOptions';
import IRafter from './IRafter';

const GLOB_PATTERN = join(__dirname, '/**/*!(.spec).js');

export default (
  {
    diAutoloader,
    logger,
    corePaths = GLOB_PATTERN,
    applicationPaths,
  }: IRafterOptions,
): IRafter => {
  const paths = [];
  if (corePaths) {
    paths.push(corePaths);
  }

  if (applicationPaths) {
    paths.push(applicationPaths);
  }

  const config: RafterConfig = {
    diAutoloader,
    paths,
    logger,
  };
  return new Rafter(config);
};
