import { IPath } from '@rafterjs/di-autoloader';
import { ILogger, loggerFactory } from '@rafterjs/logger-plugin';
// @ts-ignore
import findNodeModules from 'find-node-modules';
import { dirname, join } from 'path';
import { IPlugin } from './IPlugin';

export interface IPluginPathProvider {
  getPath(pluginConfig: IPlugin): Promise<IPath>;
}

export class PluginPathProvider implements IPluginPathProvider {
  constructor(private readonly logger: ILogger = loggerFactory('plugin path provider')) {}

  public async getPath(pluginName: IPlugin): Promise<IPath> {
    const pluginPath = await this.getPluginPath(pluginName);

    if (pluginPath) {
      return pluginPath;
    }

    throw new Error(`Could not load plugin ${pluginName}`);
  }

  private async getPluginPath(pluginName: string): Promise<string | undefined> {
    let pluginPath;
    if (require.main?.path) {
      const modulesPath: string[] = findNodeModules({ relative: false, cwd: join(require.main?.path) });

      const packageJsonPaths = modulesPath.map((path) => join(path, pluginName, `package.json`));

      pluginPath = this.getValidPackagePath(packageJsonPaths);
    } else {
      pluginPath = join(dirname(require.resolve(pluginName)), '**');
    }

    return pluginPath;
  }

  // eslint-disable-next-line consistent-return
  private getValidPackagePath(paths: string[]): string | undefined {
    for (const path of paths) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require,import/no-dynamic-require
        const packageJson = require(path);
        if (packageJson?.main) {
          const pluginPath = join(dirname(join(dirname(path), packageJson.main)), '**');
          this.logger.debug(`Found plugin path ${pluginPath}`);
          return pluginPath;
        }
      } catch (error) {
        this.logger.warn(`Failed to load the package.json from ${path}`);
      }
    }
  }
}

export type IPluginPathProviderFactoryOptions = {
  logger: ILogger;
};

export function pluginPathProviderFactory({ logger }: IPluginPathProviderFactoryOptions): PluginPathProvider {
  return new PluginPathProvider(logger);
}

export default PluginPathProvider;
