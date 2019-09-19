export interface IPluginConfig<T> {
  [name: string]: Partial<T>;
}
export type IPlugin<T> = Partial<T>;
