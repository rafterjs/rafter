export interface IDiAutoloader {
  load(): void;

  get<T>(name: string): T;
}
