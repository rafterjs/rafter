/**
 *
 */
class Provider {
  /**
   * @param {String} name
   * @param {Factory} factory
   * @param {Boolean=} isInvokable
   */
  constructor(name, factory, isInvokable) {
    this._name = name;
    this._factoryMethod = factory;
    this._dependencies = [];
    this._isInvokable = isInvokable;
    this._hasResolvedDependencies = false;
    this._instance = undefined;
  }

  /**
   * @return {String}
   */
  getName() {
    return this._name;
  }

  /**
   * @return {Factory}
   */
  getFactory() {
    return this._factoryMethod;
  }

  /**
   * @return {Boolean}
   */
  isInvokable() {
    return this._isInvokable;
  }

  /**
   * @return {Object|undefined}
   */
  getInstance() {
    return this._instance;
  }

  /**
   * @param instance {Object}
   */
  setInstance(instance) {
    this._instance = instance;
  }

  /**
   * @return {Array.<Object>}
   */
  getDependencies() {
    return this._dependencies;
  }

  /**
   * @param dependencies {Object}
   */
  setDependencies(dependencies) {
    this._dependencies = dependencies;
  }

  /**
   * @param dependency {Object}
   */
  addDependency(dependency) {
    this._dependencies.push(dependency);
  }

  /**
   * @return {boolean}
   */
  hasResolvedDependencies() {
    return this._hasResolvedDependencies;
  }

  /**
   * @param hasResolvedDependencies
   */
  setResolvedDependencies(hasResolvedDependencies) {
    this._hasResolvedDependencies = hasResolvedDependencies;
  }
}

export default Provider;
