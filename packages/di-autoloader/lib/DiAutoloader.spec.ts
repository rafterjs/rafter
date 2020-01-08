import { join } from 'path';
import { createContainer, InjectionMode } from 'awilix';
import { AwilixContainer } from 'awilix/lib/container';
import DiAutoloader from './DiAutoloader';
import TestClass from '../test/fixtures/TestClass';
import { TestConfig } from '../test/fixtures/TestConfig';
import { ILogger } from '../../utils/lib/Logger';
import TestFunction from '../test/fixtures/TestFunction';

const FIXTURES_DIR = join(__dirname, '../test', 'fixtures');

describe('BoxDI autoloader', () => {
  let mockLogger: ILogger;
  let container: AwilixContainer;

  beforeEach(() => {
    mockLogger = {
      log: jest.fn(),
      info: jest.fn(),
      debug: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    };

    container = createContainer({ injectionMode: InjectionMode.CLASSIC });
  });

  it('successfully load a simple object', () => {
    const servicesConfig = {
      config: {
        path: join(FIXTURES_DIR, 'TestConfig'),
        dependencies: [],
      },
    };
    const diAutoloader = new DiAutoloader(servicesConfig, container, mockLogger);
    diAutoloader.load();

    const config = diAutoloader.get<TestConfig>('config');
    expect(config.bar).toBe('test something');

    const bar = diAutoloader.get<string>('config');
    expect(bar).toBe('test something');
  });

  it('successfully loads a simple function', () => {
    const servicesConfig = {
      testFunction: {
        path: join(FIXTURES_DIR, 'TestFunction'),
        dependencies: [],
      },
    };

    const diAutoloader = new DiAutoloader(servicesConfig, container, mockLogger);
    diAutoloader.load();

    const testFunction = diAutoloader.get<typeof TestFunction>('testFunction');

    expect(testFunction).toBeInstanceOf(Function);
    expect(testFunction()).toBe('This is a function');
  });

  it('successfully loads a class that has dependencies', () => {
    const servicesConfig = {
      config: {
        path: join(FIXTURES_DIR, 'TestConfig'),
        dependencies: [],
      },
      testClass: {
        path: join(FIXTURES_DIR, 'TestClass'),
        dependencies: [`config.foo`, `config.foo.bar`, 'testFunction'],
      },
      testFunction: {
        path: join(FIXTURES_DIR, 'TestFunction'),
        dependencies: [],
      },
    };

    const diAutoloader = new DiAutoloader(servicesConfig, container, mockLogger);
    diAutoloader.load();

    const testClass = diAutoloader.get<TestClass>('testClass');

    expect(testClass).toBeInstanceOf(TestClass);
    expect(testClass.getData()).toBe(`here's some data`);
    expect(testClass.getBar()).toBe('test something');
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

    const diAutoloader = new DiAutoloader(servicesConfig, container, mockLogger);
    diAutoloader.load();
    expect(mockLogger.debug.mock.calls.length).toBe(1);
  });

  it.skip('instantiates the autoloader with an existing boxdi', () => {
  });

  it('fails to load a dependency that does not exist', () => {
    const servicesConfig = {
      missingDependency: {
        path: `${FIXTURES_DIR}/test-does-not-exist`,
        dependencies: [],
      },
    };

    const diAutoloader = new DiAutoloader(servicesConfig, container, mockLogger);
    diAutoloader.load();

    expect(() => {
      diAutoloader.get('missingDependency');
    }).toThrow();
  });
});
