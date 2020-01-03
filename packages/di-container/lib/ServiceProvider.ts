import { IFactoryProvider, Service } from './FactoryProvider';

export interface IServiceProvider<T extends Service> {
  getName(): string;

  getFactoryProvider(): IFactoryProvider<T>;

  isInvokable(): boolean;

  getInstance(): T | undefined;

  setInstance(instance: T): void;

  getDependencies(): object[];

  setDependencies(dependencies: object[]): void;

  addDependency(dependency: object): void;

  hasResolvedDependencies(): boolean;

  setResolvedDependencies(resolvedDependencies: boolean): void;
}

export class ServiceProvider<T extends Service> implements IServiceProvider<T> {
  private readonly name: string;

  private readonly factoryProvider: IFactoryProvider<T>;

  private dependencies: object[];

  private readonly invokable: boolean;

  private resolvedDependencies: boolean;

  private instance: T | undefined;

  constructor(name: string, factoryProvider: IFactoryProvider<T>, invokable: boolean) {
    this.name = name;
    this.factoryProvider = factoryProvider;
    this.dependencies = [];
    this.invokable = invokable;
    this.resolvedDependencies = false;
    this.instance = undefined;
  }

  public getName(): string {
    return this.name;
  }

  public getFactoryProvider(): IFactoryProvider<T> {
    return this.factoryProvider;
  }

  public isInvokable(): boolean {
    return this.invokable;
  }

  public getInstance(): T | undefined {
    return this.instance;
  }

  public setInstance(instance: T): void {
    this.instance = instance;
  }

  public getDependencies(): object[] {
    return this.dependencies;
  }

  public setDependencies(dependencies: object[]): void {
    this.dependencies = dependencies;
  }

  public addDependency(dependency: object): void {
    this.dependencies.push(dependency);
  }

  public hasResolvedDependencies(): boolean {
    return this.resolvedDependencies;
  }

  public setResolvedDependencies(resolvedDependencies: boolean): void {
    this.resolvedDependencies = resolvedDependencies;
  }
}

export default ServiceProvider;
