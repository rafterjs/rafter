import { IFactory, IFactoryClass, IFactoryProvider, Service } from '../FactoryProvider';
import { ILogger } from '@rafter/utils';
import { IServiceProvider, ServiceProvider } from '../ServiceProvider';
import isFunction from 'lodash/isFunction';

type IContainer = Map<string, IServiceProvider<Service>>;

class SimpleBox {
  private readonly container: IContainer;

  private readonly factoryProviders: IFactoryProvider<Service>[];

  private logger: ILogger;

  constructor(
    container: IContainer = new Map(),
    factories: IFactoryProvider<Service>[] = [],
    logger: ILogger = console,
  ) {
    this.container = container;
    this.factoryProviders = factories;
    this.logger = logger;
  }

  public set<T extends Service>(serviceName: string, factory: IFactory<T>, dependencies: string[]): void {
    let factoryProvider: IFactoryProvider<T>;

    if (isFunction(factory)) {
      factoryProvider = this.getFactoryProvider<T>(factory);
    }

    this.registerProvider(serviceName, factoryProvider);
  }

  private getFactoryProvider<T extends Service>(factory: IFactory<T>): IFactoryProvider<T> | undefined {
    return this.factoryProviders.find(
      registeredFactoryProvider => factory === registeredFactoryProvider.getFactory(),
    ) as IFactoryProvider<T>;
  }

  private registerProvider<T extends Service>(
    serviceName: string,
    factoryProvider: IFactoryProvider<T>,
    isInvokable = false,
  ): void {
    if (this.container.has(serviceName)) {
      throw new Error(`Module ${serviceName} is already registered. Use swap() instead.`);
    }

    this.container.set(serviceName, new ServiceProvider<T>(serviceName, factoryProvider));
  }
}