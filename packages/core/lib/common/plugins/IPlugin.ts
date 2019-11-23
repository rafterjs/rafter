export interface IPluginConfig<T> {
  [moduleName: string]: Partial<T>;
}
export type IPlugin<T> = Partial<T>;
