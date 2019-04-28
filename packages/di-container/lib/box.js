import isFunction from 'lodash.isfunction';
import cloneDeep from 'lodash.clonedeep';
import get from 'lodash.get';
import isUndefined from 'lodash.isundefined';
import find from 'lodash.find';
import forEach from 'lodash.foreach';
import winston from 'winston';
import Provider from './provider';
import Factory from './factory';

const LOG_LEVEL = {
  DEBUG: 'debug',
  INFO: 'info',
  WARNING: 'warn',
};

class Box {
  constructor() {
    this.container = {};
    this.factories = [];
    this.logger = winston;
  }

  /**
   *
   * @param {String} serviceName
   * @param {FactoryInterface|Function|Object} serviceFactory
   * @param {Array=} dependencies
   * @param {Boolean=} isInvokable
   * @public
   */
  register(serviceName, serviceFactory, dependencies, isInvokable = false) {
    let factory;

    // check for the factory pattern
    if (isFunction(serviceFactory.createInstance)) {
      factory = this.getFactory(serviceFactory.createInstance);
      this.logger.log(
        LOG_LEVEL.DEBUG,
        `Registering service provider for '${serviceName}' using the factory pattern with ` +
          `${dependencies ? dependencies.length : 'no'} dependencies`
      );
    } else if (!isUndefined(serviceFactory)) {
      factory = new Factory(serviceFactory, dependencies);
      this.logger.log(
        LOG_LEVEL.DEBUG,
        `Registering service provider for '${serviceName}' with ` +
          `${dependencies ? dependencies.length : 'no'} dependencies`
      );
    } else {
      const err = `The arguments for ${serviceName} are not valid`;
      this.logger.error(err);
      throw new Error(err);
    }

    this._registerProvider(serviceName, factory, isInvokable);
  }

  /**
   * This function name was a typo. Just leaving it here for
   * 1 release so people have time to change it out.
   *
   * @deprecated
   * @param {String} serviceName
   * @param {FactoryInterface|Function|Object} serviceFactory
   * @param {Array=} dependencies
   */
  registerInvokeable(serviceName, serviceFactory, dependencies) {
    this.registerInvokable(serviceName, serviceFactory, dependencies);
  }

  /**
   * @param {String} serviceName
   * @param {FactoryInterface|Function|Object} serviceFactory
   * @param {Array=} dependencies
   */
  registerInvokable(serviceName, serviceFactory, dependencies) {
    this.register(serviceName, serviceFactory, dependencies, true);
  }

  /**
   * Returns the invoked service if it exists in the container.
   * TODO clean up this method a bit; it is starting to become very big and complex.
   *
   * @param {String} name
   * @returns {Object}
   * @public
   */
  get(name) {
    this.logger.log(LOG_LEVEL.DEBUG, `Getting service '${name}'`);
    let deepObjectProperty;

    // check if the service name is actually requesting some deep properties.
    if (name.includes('.')) {
      deepObjectProperty = name
        .split('.')
        .slice(1)
        .join('.');
      name = name.split('.')[0]; // eslint-disable-line
    }

    const provider = this._getProvider(name);
    const factory = provider.getFactory();
    let instance = provider.getInstance();

    if (!factory) {
      throw new Error(
        `The factory for '${name}' does not exist. Please ensure that you registered the service correctly.`
      );
    }

    if (isUndefined(instance) || !factory.isSingleton()) {
      // check if the instance is already defined or if it's not a singleton
      if (!factory.isSingleton()) {
        this.logger.log(LOG_LEVEL.DEBUG, `The service '${name}' is not a singleton, creating a new instance now...`);
      } else {
        this.logger.log(LOG_LEVEL.DEBUG, `No existing instance found for service '${name}', creating one now...`);
      }

      // resolve the dependencies if they haven't been already
      if (!provider.hasResolvedDependencies()) {
        this._resolveProviderDependencies(provider);
      }

      // get the provider dependencies
      const dependencies = provider.getDependencies();
      const factoryMethod = factory.getFactoryMethod();

      // we can only check the argument length of functions, not class constructors
      // TODO, figure out a way to test number of arguments in a class constructor
      if (isFunction(factory) && factoryMethod.length !== dependencies.length) {
        throw new Error(`Module ${name} factory function arguments don't match the passed
            dependencies`);
      }

      // invoke the factory
      if (provider.isInvokable()) {
        this.logger.log(LOG_LEVEL.DEBUG, `Invoking an instance for the provider '${name}'`);

        const invokableDependencies = cloneDeep(dependencies);
        invokableDependencies.unshift(null);

        instance = new (Function.prototype.bind.apply(factoryMethod, invokableDependencies))();
      } else if (isFunction(factoryMethod)) {
        this.logger.log(LOG_LEVEL.DEBUG, `Calling the factory for the provider '${name}'`, factoryMethod);

        instance = factoryMethod(...dependencies);
      } else {
        this.logger.log(LOG_LEVEL.DEBUG, `Assigning the factory to the provider '${name}'`);
        instance = factoryMethod;
      }

      // save the instance back to the container
      if (!isUndefined(instance) && factory.isSingleton()) {
        this.logger.log(LOG_LEVEL.DEBUG, `Saving the instance back to the '${name}'`);
        provider.setInstance(instance);
      }
    }

    // return the deep object instead
    if (deepObjectProperty) {
      return get(instance, deepObjectProperty);
    }

    return instance;
  }

  /**
   * Remove the provider from the container.
   *
   * @param {String} name
   */
  remove(name) {
    if (this.container[name]) {
      delete this.container[name];
      this.logger.log(LOG_LEVEL.DEBUG, `Removed the provider '${name}' from the container`);
    } else {
      this.logger.log(
        LOG_LEVEL.WARNING,
        `Could not remove the provider '${name}' as it does not exist in the container`
      );
    }
  }

  /**
   * Removes all providers in this container.
   */
  reset() {
    forEach(this.container, (provider, name) => {
      this.remove(name);
    });
  }

  /**
   * Registers the factory to the box. This is invoked by @inject
   * so we can store the dependencies for later
   * consumption in the register method.
   *
   * @param {FactoryInterface} factoryMethod
   * @param {Array=} dependencies
   * @param {Symbol=} scope
   * @returns {Factory}
   * @public
   */
  registerFactory(factoryMethod, dependencies = [], scope) {
    if (this.isFactoryRegistered(factoryMethod)) {
      throw new Error(`Module ${factoryMethod.name} is already registered. Use swap() instead.`);
    }

    const factory = new Factory(factoryMethod, dependencies, scope);
    this.factories.push(factory);
    return factory;
  }

  /**
   * Checks if the factory is registered
   *
   * @param factory
   * @return {boolean}
   */
  isFactoryRegistered(factory) {
    const registeredFactory = this.getFactory(factory);
    return !!registeredFactory;
  }

  /**
   * @param {FactoryInterface} factory
   * @returns {Factory}
   * @public
   */
  getFactory(factory) {
    return find(this.factories, registeredFactory => factory === registeredFactory.getFactoryMethod());
  }

  /**
   *
   * @param factory
   * @param scope
   */
  setFactoryScope(factory, scope) {
    let serviceFactory;

    if (!this.isFactoryRegistered(factory)) {
      serviceFactory = this.registerFactory(factory);
    } else {
      serviceFactory = this.getFactory(factory);
    }

    serviceFactory.setScope(scope);
  }

  /**
   *
   * @param factory
   * @param dependencies
   */
  setFactoryDependencies(factory, dependencies) {
    let serviceFactory;

    if (!this.isFactoryRegistered(factory)) {
      serviceFactory = this.registerFactory(factory);
    } else {
      serviceFactory = this.getFactory(factory);
    }

    serviceFactory.setDependencies(dependencies);
  }

  /**
   * Sets the logger to use.
   *
   * @param _logger
   */
  setLogger(_logger) {
    this.logger = _logger;
  }

  /**
   * Registers the service provider to the container.
   *
   * @param {String} serviceName
   * @param {Factory} factory
   * @param {Boolean=} isInvokable
   * @private
   */
  _registerProvider(serviceName, factory, isInvokable = false) {
    if (!isUndefined(this.container[serviceName])) {
      throw new Error(`Module ${serviceName} is already registered. Use swap() instead.`);
    }
    this.container[serviceName] = new Provider(serviceName, factory, isInvokable);
  }

  /**
   * @param name
   * @return {Provider}
   * @private
   */
  _getProvider(name) {
    const serviceProvider = this.container[name];

    if (isUndefined(serviceProvider)) {
      this.logger.error(`Could not find the service '${name}'`);
      throw new Error(`Service ${name} not found`);
    }

    return serviceProvider;
  }

  /**
   * @param {Provider} provider
   * @return {Array}
   * @private
   */
  _resolveProviderDependencies(provider) {
    const factory = provider.getFactory();

    forEach(factory.getDependencies(), dependencyName => {
      if (dependencyName !== provider.getName()) {
        const dependency = this.get(dependencyName);

        provider.addDependency(dependency);
      } else {
        throw new Error(`The service ${provider.getName()} cannot depend on itself`);
      }
    });

    provider.setResolvedDependencies(true);
  }

  /**
   *
   * @param {FactoryInterface} factory
   * @returns {Array}
   * @private
   */
  _getDependencies(factory) {
    const registeredFactory = this.getFactory(factory);

    if (registeredFactory) {
      return registeredFactory.getDependencies();
    }

    throw new Error(`Could not find registered factory ${registeredFactory.name}`);
  }
}

export default new Box();
/**
 * Helper to return new instances of Box.
 * @return {Box}
 */
const createInstance = () => new Box();
export { createInstance };
