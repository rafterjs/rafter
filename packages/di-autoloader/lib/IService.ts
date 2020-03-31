import { Constructor, FunctionReturning } from 'awilix';

export type IService<T> = Constructor<T> | FunctionReturning<T> | T;
