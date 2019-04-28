export type IServiceConfig = {
  [name: string]: {
    path: string;
    dependencies: string[];
  };
};
