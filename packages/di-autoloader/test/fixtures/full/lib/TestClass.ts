/**
 * A simple test class that requires config to be injected. Notice how this class has no fancy decorators or
 * frameworks, which allows it to be tested very cleanly and easily (ie. just pass in the mock config in your tests)!
 */
import { TestConfig } from '../config/config';

class TestClass {
  private readonly config: TestConfig;

  private readonly testFunction: Function;

  private readonly data: string;

  constructor(config: TestConfig, testFunction: Function) {
    this.config = config;
    this.testFunction = testFunction;
    this.data = `here's some data`;
  }

  public getBar(): string {
    return this.config.bar;
  }

  /**
   * @return {Function}
   */
  public getFunction(): Function {
    return this.testFunction;
  }

  /**
   * @return {string}
   */
  public getData(): string {
    return this.data;
  }
}

export default TestClass;
