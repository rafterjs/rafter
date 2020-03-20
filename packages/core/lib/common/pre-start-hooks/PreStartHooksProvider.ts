import { IDiAutoloader } from '@rafter/di-autoloader';
import { ILogger } from '@rafter/utils';
import { IPreStartHook, IPreStartHookConfig } from './IPreStartHook';

export interface IPreStartHooksProvider {
  createInstance(preStartHooksConfig: string[]): IPreStartHook[];
}

/**
 * @param {IDiAutoloader} diContainer
 * @param {ILogger} logger
 * @return {PreStartHooksProvider}
 */
export default class PreStartHooksProvider implements IPreStartHooksProvider {
  private readonly diAutoloader: IDiAutoloader;

  private readonly logger: ILogger;

  constructor(diContainer: IDiAutoloader, logger: ILogger) {
    this.diAutoloader = diContainer;
    this.logger = logger;
  }

  /**
   * @param {string[]} preStartHooksConfig
   * @return {Function[]}
   */
  public createInstance(preStartHooksConfig: IPreStartHookConfig[]): IPreStartHook[] {
    const hooksCollection: IPreStartHook[] = [];

    Object.values(preStartHooksConfig).forEach(
      async (preStartHookServiceName): Promise<void> => {
        try {
          this.logger.info(`    Adding pre-start hook: ${preStartHookServiceName}`);
          const hook = this.diAutoloader.get<IPreStartHook>(preStartHookServiceName);
          hooksCollection.push(hook);
        } catch (error) {
          this.logger.error(`    Could not add pre-start hook: ${preStartHookServiceName}`, error);
        }
      },
    );

    return hooksCollection;
  }
}
