import { ILogger } from '@rafterjs/logger-plugin';
import { join, relative, isAbsolute } from 'path';
import { promisify } from 'util';
import { exec as cbExec } from 'child_process';
import chokidar from 'chokidar';

const exec = promisify(cbExec);

export type WatcherConfig = Record<
  string,
  {
    onRestart: string;
    onUpdate: string;
    options: {
      extension?: string;
      ignore?: string[];
      delay?: number;
    };
  }
>;

export type Package = {
  name: string;
  version: string;
  path: string;
  isUpdating: boolean;
};

export type PackageConfig = {
  name: string;
  version: string;
  location: string;
  private: boolean;
};

export class Watcher {
  private readonly config: WatcherConfig;

  private readonly logger: ILogger;

  private readonly packages: Package[] = [];

  private readonly lookupPaths: Map<string, Package> = new Map<string, Package>();

  constructor(config: WatcherConfig, logger: ILogger) {
    this.config = config;
    this.logger = logger;
  }

  public async start(): Promise<void> {
    await this.initPackages();
    this.watch();
  }

  private async exec(command: string): Promise<string> {
    const { stdout, stderr } = await exec(command);
    if (stdout) {
      return stdout;
    }
    const errorMessage = `Failed to execute ${command}`;
    this.logger.error(errorMessage, stderr);
    throw new Error(errorMessage);
  }

  private async initPackages(): Promise<void> {
    const packagesConfig: PackageConfig[] = JSON.parse(await this.exec('lerna list --json'));

    for (const packageConfig of packagesConfig) {
      const packageData: Package = {
        name: packageConfig.name,
        version: packageConfig.version,
        path: packageConfig.location,
        isUpdating: false,
      };

      this.packages.push(packageData);
      this.lookupPaths.set(packageData.path, packageData);
    }
  }

  private getUpdatedPackage(path: string): Package {
    for (const [key, packageData] of this.lookupPaths.entries()) {
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

  private watch(): void {
    const pathLookup: Map<string, Package> = new Map<string, Package>();

    const watchedPaths: string[] = this.packages.map((packageData: Package): string => {
      pathLookup.set(packageData.path, packageData);
      return join(packageData.path, '**/*.ts');
    });

    this.logger.info('Watching the following paths: ', watchedPaths);

    const watcher = chokidar.watch(watchedPaths, {
      ignored: '**/dist/**',
      followSymlinks: false,
      usePolling: true,
      interval: 500,
      binaryInterval: 500,
    });

    watcher.on('change', this.onChange.bind(this));
  }

  private async onChange(path: string): Promise<void> {
    this.logger.info(`"${path}" has changed`);
    const packageData = this.getUpdatedPackage(path);

    if (!packageData.isUpdating) {
      packageData.isUpdating = true;
      this.logger.info(`${packageData.name} will now update... please wait`);

      const output = await this.exec(`lerna run build --scope ${packageData.name}`);
      this.logger.info(output);
      this.logger.info(`${packageData.name} successfully completed updating`);
      packageData.isUpdating = false;
    } else {
      this.logger.info(`${packageData.name} is already in the process of updating`);
    }
  }
}
