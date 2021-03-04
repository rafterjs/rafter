export interface ITransformer<T, K> {
  convert(source: T): K;
}
