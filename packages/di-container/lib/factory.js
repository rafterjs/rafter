import { singleton, prototype } from './scope-constants';

/**
 *
 */
class Factory {
  /**
   * @param {Function|Object} factoryMethod
   * @param {Array.<Object>} dependencies
   * @param {Symbol=} scope
   */
  constructor(factoryMethod, dependencies = [], scope = singleton) {
    this._factoryMethod = factoryMethod;
    this._dependencies = dependencies;
    this._scope = scope;
  }

  /**
   * @return {Function|Object}
   */
  getFactoryMethod() {
    return this._factoryMethod;
  }

  /**
   * @param {Function|Object} factoryMethod
   */
  setFactoryMethod(factoryMethod) {
    this._factoryMethod = factoryMethod;
  }

  /**
   * @return {Array.<Object>}
   */
  getDependencies() {
    return this._dependencies;
  }

  /**
   * @param {Array.<Object>} dependencies
   */
  setDependencies(dependencies) {
    this._dependencies = dependencies;
  }

  /**
   * @return {Symbol}
   */
  getScope() {
    return this._scope;
  }

  /**
   * @param {Symbol} scope
   */
  setScope(scope) {
    this._scope = scope;
  }

  /**
   * @return {Boolean}
   */
  isSingleton() {
    return this.getScope() === singleton;
  }

  /**
   * @return {Boolean}
   */
  isPrototype() {
    return this.getScope() === prototype;
  }
}

export default Factory;
