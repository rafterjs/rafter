import Box from './lib/box';
import inject from './lib/inject';
import { scope } from './lib/scope';
import { prototype, singleton } from './lib/scope-constants';
import FactoryInterface from './lib/factory-interface';

// es5 export
export default {
  Box,
  inject,
  scope,
  prototype,
  singleton,
  FactoryInterface,
};

// es6 exports
export {
  Box, inject, scope, singleton, prototype, FactoryInterface,
};
