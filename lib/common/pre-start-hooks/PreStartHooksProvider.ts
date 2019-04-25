/**
 * @param {Box} diContainer
 * @param {Logger} logger
 * @return {PreStartHooksProvider}
 */
import {ILogger} from '../../utils/ILogger';
import {IDiContainer} from '../../vendor/BoxDiFactory';
import {IPreStartHook} from './IPreStartHook';

export default class PreStartHooksProvider {
  diContainer: IDiContainer;
  logger: ILogger;

  constructor(diContainer: IDiContainer, logger: ILogger) {
    this.diContainer = diContainer;
    this.logger = logger;
  }

  /**
   * @param {string[]} preStartHooksConfig
   * @return {Function[]}
   */
  public createInstance(preStartHooksConfig: string[]): IPreStartHook[] {
    const hooksCollection: IPreStartHook[] = [];

    Object.values(preStartHooksConfig)
      .forEach(async preStartHookServiceName => {
        try {
          this.logger.info(`    Adding pre-start hook: ${preStartHookServiceName}`);
          const hook = this.diContainer.get<IPreStartHook>(preStartHookServiceName);
          hooksCollection.push(hook);
        } catch (error) {
          this.logger.error(`    Could not add pre-start hook: ${preStartHookServiceName}`, error);
        }
      });

    return hooksCollection;
  }
}
