import isFunction from 'lodash.isfunction';
import Box from './box';

/**
 * A decorator that injects dependencies into the di container
 *
 * @param dependencies {Array}
 * @returns {function()}
 */
export default (...dependencies) => factory => {
  if (isFunction(factory.createInstance)) {
    Box.setFactoryDependencies(factory.createInstance, dependencies);
  } else {
    throw new Error(`The factory ${factory.name} has a non-standard interface.
            Please create one with a static method "createInstance"`);
  }
};
