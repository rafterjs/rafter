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
    let validPath;

    try {
      validPath = join(dirname(require.resolve(pluginName)), `**`);
    } catch (error) {
      this.logger.warn(`Failed to load the package.json for ${pluginName}, trying another approach`);

      // NOTE: this is pretty heavy handed, but the way npm works the dependencies could be anywhere!
      const modulesPaths: string[] = require.main?.paths || findNodeModules({ relative: false });
      const packageJsonPaths = modulesPaths.map((modulesPath) => join(modulesPath, pluginName, `package.json`));
      this.logger.debug(`Checking the following node_modules for the package: ${packageJsonPaths.join(', ')}`);

      validPath = this.getValidPackagePath(packageJsonPaths);
    }

    return validPath;
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

export default PluginPathProvider;
