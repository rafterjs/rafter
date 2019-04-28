class FactoryInterface {
  constructor() {
    if (this.constructor === FactoryInterface) {
      throw new Error(`Constructing an interface is not allowed: ${this.constructor}`);
    }
  }

  /**
   * Creates an instance of an object / class / function.
   *
   * @return {*}
   */
  static createInstance() {
    throw new Error('Implementation required for createInstance');
  }
}

export default FactoryInterface;
