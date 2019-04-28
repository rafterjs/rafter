import Test from './test';
import { scope, prototype, inject, FactoryInterface } from '@rafter/di-container';

/**
 * A test factory with the fancy decorators that will tell {@link Box} what dependencies to instantiate the class with.
 */
class TestFactory extends FactoryInterface {
  @scope(prototype)
  @inject('config')
  static createInstance(config) {
    return new Test(config);
  }
}

export default TestFactory;
