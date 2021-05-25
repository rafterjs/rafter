import { IDiAutoloader } from '@rafterjs/di-autoloader';
import { ILogger } from '@rafterjs/logger-plugin';
import { IPreStartHook, IPreStartHooks } from './IPreStartHook';

export interface IPreStartHooksProvider {
  createInstance(preStartHooksConfig: IPreStartHooks): IPreStartHook[];
}

export class PreStartHooksProvider implements IPreStartHooksProvider {
  constructor(private readonly diAutoloader: IDiAutoloader, private readonly logger: ILogger) {}

  public createInstance(preStartHooksConfig: IPreStartHooks): IPreStartHook[] {
    const hooksCollection: IPreStartHook[] = [];

    this.logger.info(`    Creating pre-start hooks from:`, preStartHooksConfig);

    for (const preStartHookServiceName of preStartHooksConfig) {
      try {
        this.logger.info(`    Adding pre-start hook: ${preStartHookServiceName}`);
        const hook = this.diAutoloader.get<IPreStartHook>(preStartHookServiceName);
        hooksCollection.push(hook);
      } catch (error) {
        this.logger.error(`    Could not add pre-start hook: ${preStartHookServiceName}`, error);
      }
    }

    return hooksCollection;
  }
}

export default PreStartHooksProvider;
