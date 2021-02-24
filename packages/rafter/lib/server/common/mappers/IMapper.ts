export interface IMapper<T, K> {
  map(source: T, target: K): K;
}
