import { IScope, Prototype, Singleton } from './ScopeConstants';

export type Service = object;

export type LengthWise = {
  length: number;
};

export type IFactoryFunction<T extends Service> = () => T;

export interface IFactoryClass<T extends Service> {
  createInstance(): T;
}

export type IFactory<T extends Service> = IFactoryClass<T> | IFactoryFunction<T> | T;

export interface IFactoryProvider<T extends Service> {
  getFactory(): IFactory<T>;

  setFactory(factory: IFactory<T>): void;

  getDependencies(): string[];

  setDependencies(dependencies: string[]): void;

  getScope(): IScope;

  setScope(scope: IScope): void;

  isSingleton(): boolean;

  isPrototype(): boolean;
}

export class FactoryProvider<T extends Service> implements IFactoryProvider<T> {
  private factory: IFactory<T>;

  private dependencies: string[];

  private scope: IScope;

  constructor(factory: IFactory<T>, dependencies: string[] = [], scope: IScope = Singleton) {
    this.factory = factory;
    this.dependencies = dependencies;
    this.scope = scope;
  }

  public getFactory(): IFactory<T> {
    return this.factory;
  }

  public setFactory(factory: IFactory<T>): void {
    this.factory = factory;
  }

  public getDependencies(): string[] {
    return this.dependencies;
  }

  public setDependencies(dependencies: string[]): void {
    this.dependencies = dependencies;
  }

  public getScope(): IScope {
    return this.scope;
  }

  public setScope(scope: IScope): void {
    this.scope = scope;
  }

  public isSingleton(): boolean {
    return this.getScope() === Singleton;
  }

  public isPrototype(): boolean {
    return this.getScope() === Prototype;
  }
}

export default FactoryProvider;
