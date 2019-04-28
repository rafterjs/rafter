/**
 * A simple test class that requires config to be injected. Notice how this class has no fancy decorators or
 * frameworks, which allows it to be tested very cleanly and easily (ie. just pass in the mock config in your tests)!
 */
class InvokableTest {
  constructor(config) {
    this.config = config;
  }

  getConfig() {
    return this.config;
  }

  getData() {
    return `here's some data`;
  }
}

export default InvokableTest;
