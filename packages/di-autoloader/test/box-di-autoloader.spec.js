import BoxDiAutoLoader from '../lib/box-di-autoloader';
import TestClass from './fixtures/test-class';
import { join } from 'path';

const FIXTURES_DIR = join(__dirname, 'fixtures');

describe('BoxDI autoloader', () => {
  let mockLogger;

  beforeEach(() => {
    mockLogger = {
      log: jest.fn(),
      info: jest.fn(),
      debug: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    };
  });

  it('successfully loads a simple object', () => {
    const servicesConfig = {
      config: {
        path: join(FIXTURES_DIR, 'test-config'),
        dependencies: [],
      },
    };

    const boxDiAutoLoader = new BoxDiAutoLoader(servicesConfig, undefined, mockLogger);
    boxDiAutoLoader.load();

    const config = boxDiAutoLoader.get('config');
    expect(config.foo.bar).toBe('test something');

    const bar = boxDiAutoLoader.get('config.foo.bar');
    expect(bar).toBe('test something');
  });

  it('successfully loads a simple function', () => {
    const servicesConfig = {
      testFunction: {
        path: join(FIXTURES_DIR, 'test-function'),
        dependencies: [],
      },
    };

    const boxDiAutoLoader = new BoxDiAutoLoader(servicesConfig, undefined, mockLogger);
    boxDiAutoLoader.load();

    const testFunction = boxDiAutoLoader.get('testFunction');

    expect(testFunction).toBeInstanceOf(Function);
    expect(testFunction()).toBe('This is a function');
  });

  it('successfully loads a class that has dependencies', () => {
    const servicesConfig = {
      config: {
        path: join(FIXTURES_DIR, 'test-config'),
        dependencies: [],
      },
      testClass: {
        path: join(FIXTURES_DIR, 'test-class'),
        dependencies: [`config.foo`, `config.foo.bar`, 'testFunction'],
      },
      testFunction: {
        path: join(FIXTURES_DIR, 'test-function'),
        dependencies: [],
      },
    };

    const boxDiAutoLoader = new BoxDiAutoLoader(servicesConfig, undefined, mockLogger);
    boxDiAutoLoader.load();

    const testClass = boxDiAutoLoader.get('testClass');

    expect(testClass).toBeInstanceOf(TestClass);
    expect(testClass.getData()).toBe(`here's some data`);
    expect(testClass.getBar()).toBe('test something');
    expect(testClass.getFoo().bar).toBe('test something');
    expect(testClass.getFunction()).toBeInstanceOf(Function);
    expect(testClass.getFunction()()).toBe('This is a function');
  });

  it('instantiates autoloader with a custom logger', () => {
    const servicesConfig = {
      config: {
        path: `${FIXTURES_DIR}/test-config`,
        dependencies: [],
      },
    };

    const boxDiAutoLoader = new BoxDiAutoLoader(servicesConfig, undefined, mockLogger);
    boxDiAutoLoader.load();
    expect(mockLogger.debug.mock.calls.length).toBe(1);
  });

  it.skip('instantiates the autoloader with an existing boxdi', () => {});

  it('fails to load a dependency that does not exist', () => {
    const servicesConfig = {
      missingDependency: {
        path: `${FIXTURES_DIR}/test-does-not-exist`,
        dependencies: [],
      },
    };

    const boxDiAutoLoader = new BoxDiAutoLoader(servicesConfig, undefined, mockLogger);
    boxDiAutoLoader.load();

    expect(() => {
      boxDiAutoLoader.get('missingDependency');
    }).toThrow();
  });
});
