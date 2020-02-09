import { join, relative } from 'path';
import { createStubInstance } from 'sinon';
import { LoggingService } from '@rafter/utils';
import { createContainer, InjectionMode } from 'awilix';
import { AwilixContainer } from 'awilix/lib/container';
import DiAutoloader from './DiAutoloader';
import TestClass from '../test/fixtures/TestClass';
import { TestConfig } from '../test/fixtures/config';
import TestFunction from '../test/fixtures/testFunction';

const FIXTURES_DIR = join(__dirname, '../test', 'fixtures');

jest.mock('@rafter/utils');

describe('DI Autoloader', () => {
  const mockLogger = createStubInstance(LoggingService);

  let container: AwilixContainer;

  beforeEach(() => {
    container = createContainer({});
  });

  it('successfully load a simple object', () => {
    const joinedPath = join(FIXTURES_DIR, 'config.ts');

    const diAutoloader = new DiAutoloader(container, mockLogger);
    diAutoloader.loadModules([joinedPath]);

    const config = diAutoloader.get<TestConfig>('config');
    expect(config.bar).toBe('test something');

    const bar = diAutoloader.get<string>('config.bar');
    expect(bar).toBe('test something');
  });

  it('successfully loads a simple function', () => {
    const functionPath = join(FIXTURES_DIR, 'testFunction.ts');

    const diAutoloader = new DiAutoloader(container, mockLogger);
    diAutoloader.loadModules([functionPath]);

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

    const dependenciesPath = join(FIXTURES_DIR, '*.ts');

    const diAutoloader = new DiAutoloader(container, mockLogger);
    diAutoloader.loadModules([dependenciesPath]);

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

    const diAutoloader = new DiAutoloader(container, mockLogger);
    diAutoloader.load();
    expect(mockLogger.debug.calledOnce).toBeTruthy();
  });

  it.skip('instantiates the autoloader with an existing boxdi', () => {
    // TODO
  });

  it('fails to load a dependency that does not exist', () => {
    const servicesConfig = {
      missingDependency: {
        path: `${FIXTURES_DIR}/test-does-not-exist`,
        dependencies: [],
      },
    };

    const diAutoloader = new DiAutoloader(container, mockLogger);
    diAutoloader.load();

    expect(() => {
      diAutoloader.get('missingDependency');
    }).toThrow();
  });
});
