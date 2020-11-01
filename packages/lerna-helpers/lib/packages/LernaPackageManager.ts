import loggerFactory, { ILogger } from '@rafterjs/logger-plugin';
import { isAbsolute, relative } from 'path';
import { DEFAULT_COMMANDS } from '../LernaConstants';
import { ProcessExecutor } from '../ProcessExecutor';
import { Package } from './Package';
import { PackageConfig } from './PackageConfig';
import { PackagePathMap } from './PackagePathMap';

export interface ILernaPackageManager {
  init(): Promise<void>;

  getPackages(): Package[];

  getPackagePaths(): PackagePathMap;

  getPackageByPath(path: string): Package;
}

export class LernaPackageManager implements ILernaPackageManager {
  private readonly logger: ILogger;

  private readonly packages: Package[] = [];

  private readonly packagePaths: PackagePathMap = new PackagePathMap();

  constructor(logger: ILogger) {
    this.logger = logger;
  }

  public async init(): Promise<void> {
    const packagesConfig: PackageConfig[] = JSON.parse(ProcessExecutor.execute(DEFAULT_COMMANDS.PACKAGES));

    for (const packageConfig of packagesConfig) {
      const packageData: Package = {
        name: packageConfig.name,
        version: packageConfig.version,
        path: packageConfig.location,
        isUpdating: false,
      };

      this.packages.push(packageData);
      this.packagePaths.set(packageData.path, packageData);
    }
  }

  public getPackages(): Package[] {
    return this.packages;
  }

  public getPackagePaths(): PackagePathMap {
    return this.packagePaths;
  }

  public getPackageByPath(path: string): Package {
    for (const [key, packageData] of this.packagePaths.entries()) {
      if (this.isSubDirectory(key, path)) {
        return packageData;
      }
    }

    throw Error(`Failed to get package`);
  }

  private isSubDirectory(parent: string, child: string): boolean {
    const relativeDir = relative(parent, child);

    return !!relativeDir && !relativeDir.startsWith('..') && !isAbsolute(relativeDir);
  }
}

export function factory() {
  const logger = loggerFactory();
  return new LernaPackageManager(logger);
}

export default LernaPackageManager;
