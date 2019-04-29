import { IDiContainer } from '@rafter/di-container';
import { ILogger } from '../../utils/ILogger';
import { IPreStartHook, IPreStartHookConfig } from './IPreStartHook';

export interface IPreStartHooksProvider {
  createInstance(preStartHooksConfig: string[]): IPreStartHook[];
}

/**
 * @param {IDiContainer} diContainer
 * @param {ILogger} logger
 * @return {PreStartHooksProvider}
 */
export default class PreStartHooksProvider implements IPreStartHooksProvider {
  private readonly diContainer: IDiContainer;

  private readonly logger: ILogger;

  constructor(diContainer: IDiContainer, logger: ILogger) {
    this.diContainer = diContainer;
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
          const hook = this.diContainer.get<IPreStartHook>(preStartHookServiceName);
          hooksCollection.push(hook);
        } catch (error) {
          this.logger.error(`    Could not add pre-start hook: ${preStartHookServiceName}`, error);
        }
      },
    );

    return hooksCollection;
  }
}
