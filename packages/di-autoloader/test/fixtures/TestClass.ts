/**
 * A simple test class that requires config to be injected. Notice how this class has no fancy decorators or
 * frameworks, which allows it to be tested very cleanly and easily (ie. just pass in the mock config in your tests)!
 */
class TestClass {
  constructor(foo, bar, testFunction) {
    this._foo = foo;
    this._bar = bar;
    this._testFunction = testFunction;
    this._data = `here's some data`;
  }

  /**
   * @return {string}
   */
  getBar() {
    return this._bar;
  }

  /**
   * @return {string}
   */
  getFoo() {
    return this._foo;
  }

  /**
   * @return {Function}
   */
  getFunction() {
    return this._testFunction;
  }

  /**
   * @return {string}
   */
  getData() {
    return this._data;
  }
}

export default TestClass;
