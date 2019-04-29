export interface IServiceConfig {
  [name: string]: {
    path: string;
    dependencies: string[];
  };
}
