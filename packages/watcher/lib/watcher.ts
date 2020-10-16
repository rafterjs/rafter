import { join } from 'path';
import { promisify } from 'util';
import { exec as cbExec } from 'child_process';
import chokidar from 'chokidar';

const exec = promisify(cbExec);

export type WatcherConfig = Record<
  string,
  {
    onRestart: string;
    onChange: string;
    options: {
      extension?: string;
      ignore?: string[];
      delay?: number;
    };
  }
>;

export type PackageConfig = {
  name: string;
  version: string;
  location: string;
  private: boolean;
};

export type Package = {
  name: string;
  version: string;
  path: string;
};

// get dependencies
const dependencies = `lerna list --scope @rafterjs/boilerplate --include-dependencies`;

// get path for each

// watch all paths for dependencies

async function getPackages(): Promise<Set<Package>> {
  const packages = new Set<Package>();
  const { stdout } = await exec('lerna list --json');
  if (stdout) {
    const packagesConfig: PackageConfig[] = JSON.parse(stdout);

    for (const packageData of packagesConfig) {
      packages.add({
        name: packageData.name,
        version: packageData.version,
        path: packageData.location,
      });
    }
  }

  return packages;
}

async function watchPackages(packages: Set<Package>): Promise<void> {
  const watchedPaths: string[] = Array.from(packages.values()).map((packageData: Package): string => {
    return join(packageData.path, '**/*.ts');
  });
  console.log('----------------------');
  console.log(watchedPaths);

  const watcher = chokidar.watch(watchedPaths, {
    ignored: '**/dist/**',
    followSymlinks: false,
    usePolling: true,
    interval: 500,
    binaryInterval: 500,
  });

  watcher.on('change', (path) => {
    console.log('----------CHANGED', path);
  });

  // nodemon({
  //   ext: 'ts',
  //   watch: watchedPaths,
  //   ignore: ['node_modules/*', 'dist/*'],
  //   exec: 'echo "hi"',
  //   delay: 300,
  // });
}

async function run() {
  const packages = await getPackages();

  console.log('----', packages);

  await watchPackages(packages);
}

run();
