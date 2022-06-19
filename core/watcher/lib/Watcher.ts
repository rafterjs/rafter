import { ILogger } from '@rafterjs/logger-plugin';
import { Matcher } from 'anymatch';
import { ChildProcess } from 'child_process';
import chokidar, { FSWatcher } from 'chokidar';
import { isAbsolute, join, relative } from 'path';
import treeKill from 'tree-kill';
import { execute, executeChild } from './Executor';
import { DEFAULT_COMMANDS, PACKAGE_TOKEN } from './WatcherConstants';

export type Match = Matcher;

export type WatcherConfig = {
  command: string;
  onChange: string;
  options: {
    extension?: string;
    ignore?: Match;
    delay?: number;
  };
};

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
  private readonly packages: Package[] = [];

  private watching?: FSWatcher;

  private process?: ChildProcess;

  private isExecuting = false;

  private readonly lookupPaths: Map<string, Package> = new Map<string, Package>();

  constructor(private readonly config: WatcherConfig, private readonly logger: ILogger) {}

  public async start(): Promise<void> {
    // load up all the lerna packages into the class state
    await this.initPackages();

    // execute the provided command
    await this.executeCommand();

    // watch all the lerna packages for changes
    this.watch();
  }

  private async executeCommand(): Promise<void> {
    const { command } = this.config;
    if (!this.isExecuting) {
      if (this.process) {
        this.logger.info(`❌ Killing the existing process.`);
        treeKill(this.process.pid);
        this.logger.info(`✔ Killed the existing process.`);
        this.process = undefined;
      }

      this.isExecuting = true;
      this.logger.info(`⏳ Executing "${command}". Please wait...`);

      this.process = executeChild(command);

      this.process?.on('close', (code) => {
        this.logger.info(`✔ The process for "${command}" has now completed with code "${code}"`);
      });

      if (this.process?.stdout) {
        this.logger.info(`⏳ Watching stdout from the process "${command}"....`);

        this.process.stdout.setEncoding('utf8');
        this.process.stdout.on('data', (data) => {
          this.logger.debug(data.toString());
        });
      }

      if (this.process?.stderr) {
        this.logger.info(`⏳ Watching stderr from the process "${command}"....`);
        this.process.stderr.on('data', (data) => {
          this.logger.error(`❌
          ${data.toString()}`);
        });
      }

      this.isExecuting = false;
      this.logger.info(`✔ Successfully executed "${command}":`);
    } else {
      this.logger.warn(`⏳ The command "${command}' is already executing. Please wait...`);
    }
  }

  private async initPackages(): Promise<void> {
    const packagesConfig: PackageConfig[] = JSON.parse(execute(DEFAULT_COMMANDS.PACKAGES));

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
    if (this.watching) {
      // if we are already watching, ensure that it is closed to prevent duplicate events
      this.watching.close();
    }

    const { extension = 'ts', ignore = [], delay = 500 } = this.config.options;

    const watchedPaths: string[] = this.packages.map((packageData: Package): string => {
      return join(packageData.path, `**/*.${extension}`);
    });

    this.logger.info('👀 Watching the following paths: ', watchedPaths);

    this.watching = chokidar.watch(watchedPaths, {
      ignored: ignore,
      followSymlinks: false,
      usePolling: true,
      interval: delay,
      binaryInterval: delay,
    });

    this.watching.on('change', this.handleOnChange.bind(this));
  }

  private async handleOnChange(path: string): Promise<void> {
    this.logger.info(`⏳ "${path}" has changed`);
    const packageData = this.getUpdatedPackage(path);

    try {
      if (!packageData.isUpdating) {
        packageData.isUpdating = true;
        const { onChange } = this.config;

        const onChangeCommand = this.getInterpolatedCommand(onChange, packageData.name);
        this.logger.info(`⏳ ${packageData.name} will now run "${onChangeCommand}"... please wait`);

        const onUpdateOutput = execute(onChangeCommand);
        this.logger.debug(onUpdateOutput);

        this.logger.info(`✔ Successfully completed updating ${packageData.name}`);
        packageData.isUpdating = false;

        await this.executeCommand();
      } else {
        this.logger.info(`👀 ${packageData.name} is already in the process of updating`);
      }
    } catch (error) {
      this.logger.error(`❌ Something failed during onChange`, error);
      packageData.isUpdating = false;
    }
  }

  private getInterpolatedCommand(command: string, packageName: string): string {
    return command.replace(PACKAGE_TOKEN, packageName);
  }
}
