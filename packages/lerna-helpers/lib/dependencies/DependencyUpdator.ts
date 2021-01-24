import loggerFactory, { ILogger } from '@rafterjs/logger-plugin';
import { LernaPackageManager, lernaPackageManagerFactory, Package } from '../packages';
import { ProcessExecutor } from '../ProcessExecutor';
import { YARN_COMMANDS } from './DependencyConstants';

export class DependencyUpdator {
  private readonly lernaPackageManager: LernaPackageManager;

  private readonly logger: ILogger;

  constructor(lernaPackageManager: LernaPackageManager, logger: ILogger) {
    this.lernaPackageManager = lernaPackageManager;
    this.logger = logger;
  }

  public async update() {
    const packages = await this.lernaPackageManager.getPackages(true);

    for (const lernaPackage of packages) {
      this.updateDependencies(lernaPackage);
    }
  }

  private async updateDependencies(lernaPackage: Package): Promise<void> {
    try {
      this.logger.info(`⏳ Running update on ${lernaPackage.name}`);

      // run install to ensure there's a yarn.lock then run update
      ProcessExecutor.execute(`cd ${lernaPackage.path} && rimraf yarn.lock`);
      ProcessExecutor.execute(`cd ${lernaPackage.path} && ${YARN_COMMANDS.INSTALL}`);
      const process = ProcessExecutor.execute(`cd ${lernaPackage.path} && ${YARN_COMMANDS.UPGRADE}`);

      this.logger.info(`✔ Successfully updated dependencies for ${lernaPackage.name}
      `);
      this.logger.debug(`${process}
      
      `);
    } catch (error) {
      console.log('--------------------', error.message)
      if (error.message === 'Outdated lockfile') {

        this.logger.debug(`Updating the lockfile...`);
        // ProcessExecutor.execute(`cd ${lernaPackage.path} && ${YARN_COMMANDS.IMPORT}`);
      } else {
        this.logger.error(`❌ Failed to update dependencies for ${lernaPackage.name}
      `);
        this.logger.debug(`${error}
      
      `);
      }
    }
  }
}

export function dependencyUpdatorFactory(logger: ILogger = loggerFactory()) {
  return new DependencyUpdator(lernaPackageManagerFactory(logger), logger);
}

export default DependencyUpdator;
