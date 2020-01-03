import { createInstance, default as Box } from './lib/box';
import inject from './lib/inject';
import { scope } from './lib/scope';
import { Prototype, Singleton } from './lib/ScopeConstants';
import IFactory from './lib/IFactory';

// es5 export
export default {
  Box,
  inject,
  scope,
  prototype: Prototype,
  singleton: Singleton,
  FactoryInterface: IFactory,
  createInstance,
};

// es6 exports
export { Box, inject, scope, Singleton, Prototype, IFactory, createInstance };
