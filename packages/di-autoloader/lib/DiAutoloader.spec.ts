import { join } from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createStubInstance } from 'sinon';
import { LoggingService } from '@rafter/utils';
import { createContainer, InjectionMode } from 'awilix';
import { AwilixContainer } from 'awilix/lib/container';
import { DiAutoloader } from './DiAutoloader';
import TestClass from '../test/fixtures/full/lib/TestClass';
import TestFunction from '../test/fixtures/full/lib/TestFunction';

const FIXTURES_DIR = join(__dirname, '../test/fixtures/**');

jest.mock('@rafter/utils');

describe('DI Autoloader', () => {
  const mockLogger = createStubInstance(LoggingService);

  let container: AwilixContainer;

  beforeEach(() => {
    container = createContainer({
      injectionMode: InjectionMode.CLASSIC,
    });
  });

  describe('load', () => {
    it('successfully loads a simple function', () => {
      const functionPath = join(FIXTURES_DIR, 'testFunction.ts');

      const diAutoloader = new DiAutoloader(container, mockLogger);
      diAutoloader.load([functionPath]);

      const testFunction = diAutoloader.get<typeof TestFunction>('testFunction');

      expect(testFunction).toBeInstanceOf(Function);
      expect(testFunction()).toBe('This is a function');
    });

    it('successfully loads a class that has dependencies', () => {
      const dependenciesPath = join(FIXTURES_DIR, '*.ts');

      const diAutoloader = new DiAutoloader(container, mockLogger);
      diAutoloader.load([dependenciesPath]);

      const testClass = diAutoloader.get<TestClass>('testClass');

      expect(testClass).toBeInstanceOf(TestClass);
      expect(testClass.getData()).toBe(`here's some data`);
      expect(testClass.getBar()).toBe('test something');
      expect(testClass.getFunction()).toBeInstanceOf(Function);
      expect(testClass.getFunction()()).toBe('This is a function');
    });

    it('list all modules that are present in the passed path glob', () => {
      const dependenciesPath = join(FIXTURES_DIR, '*.ts');

      const diAutoloader = new DiAutoloader(container, mockLogger);
      const modules = diAutoloader.list(dependenciesPath);

      expect(modules).toHaveLength(3);
      expect(modules[0].name).toEqual('config');
      expect(modules[1].name).toEqual('TestClass');
      expect(modules[2].name).toEqual('TestFunction');
    });

    it('instantiates autoloader with a custom logger', () => {
      const diAutoloader = new DiAutoloader(container, mockLogger);
      diAutoloader.load([join(FIXTURES_DIR, 'config.ts')]);
      expect(mockLogger.debug.called).toBeTruthy();
    });

    it('fails to load a dependency that does not exist', () => {
      const diAutoloader = new DiAutoloader(container, mockLogger);
      diAutoloader.load([join(FIXTURES_DIR, 'config.ts')]);

      expect(() => {
        diAutoloader.get('missingDependency');
      }).toThrow();
    });
  });
});
