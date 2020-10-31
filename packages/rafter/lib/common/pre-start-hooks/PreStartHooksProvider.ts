import { IDiAutoloader } from '@rafterjs/di-autoloader';
import { ILogger } from '@rafterjs/logger-plugin';
import { IPreStartHook, IPreStartHookConfig } from './IPreStartHook';

export interface IPreStartHooksProvider {
  createInstance(preStartHooksConfig: string[]): IPreStartHook[];
}

export default class PreStartHooksProvider implements IPreStartHooksProvider {
  private readonly diAutoloader: IDiAutoloader;

  private readonly logger: ILogger;

  constructor(diAutoloader: IDiAutoloader, logger: ILogger) {
    this.diAutoloader = diAutoloader;
    this.logger = logger;
  }

  public createInstance(preStartHooksConfig: IPreStartHookConfig[]): IPreStartHook[] {
    const hooksCollection: IPreStartHook[] = [];

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
