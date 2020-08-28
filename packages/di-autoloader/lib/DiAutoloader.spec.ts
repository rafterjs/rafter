import { join } from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createStubInstance } from 'sinon';
import { createContainer, InjectionMode } from 'awilix';
import { AwilixContainer } from 'awilix/lib/container';
import { ILogger, MockLogger } from '@rafterjs/logger-plugin';
import { DiAutoloader } from './DiAutoloader';
import TestClass from '../test/fixtures/full/lib/TestClass';
import { config2, TestConfig2 } from '../test/fixtures/full/config/config';
import { config1, TestConfig1 } from '../test/fixtures/full/lib/config';
import { routes1 } from '../test/fixtures/full/config/routes';
import { routes2 } from '../test/fixtures/full/lib/routes';
import TestFunction from '../test/fixtures/full/lib/TestFunction';

const FIXTURES_DIR = join(__dirname, '../test/fixtures');
const FIXTURES_GLOB = join(FIXTURES_DIR, '**');
const PATH_GLOB_SUFFIX = '/*.*';

jest.mock('@rafterjs/logger-plugin');

describe('DI Autoloader', () => {
  const mockLogger = createStubInstance<ILogger>(MockLogger);

  let container: AwilixContainer;

  beforeEach(() => {
    container = createContainer({
      injectionMode: InjectionMode.CLASSIC,
    });
  });

  describe('load', () => {
    it('successfully register configs', async () => {
      const diAutoloader = new DiAutoloader(container, mockLogger);
      const configMap1 = new Map();
      configMap1.set('config', config1);
      const configMap2 = new Map();
      configMap2.set('config', config2());
      await diAutoloader.registerMergableFiles(configMap1);
      await diAutoloader.registerMergableFiles(configMap2);

      const testConfig = diAutoloader.get<TestConfig1 & TestConfig2>('config');
      expect(testConfig.foo).toBe('foo not overridden');
      expect(testConfig.bar).toBe('bar overridden');
    });

    it('successfully merge routes', async () => {
      const diAutoloader = new DiAutoloader(container, mockLogger);
      const routeMap1 = new Map();
      routeMap1.set('routes', routes1);
      const routeMap2 = new Map();
      routeMap2.set('routes', routes2());
      await diAutoloader.registerMergableFiles(routeMap1);
      await diAutoloader.registerMergableFiles(routeMap2);

      const routes = diAutoloader.get('routes');
      expect(routes).toHaveLength(2);
      expect(routes[0]).toEqual({
        endpoint: `/`,
        controller: `testController`,
        action: `index`,
        method: `get`,
      });
      expect(routes[1]).toEqual({
        endpoint: `/test`,
        controller: `testController`,
        action: `index`,
        method: `get`,
      });
    });

    it('successfully loads a simple function', async () => {
      const functionPath = join(FIXTURES_GLOB, 'TestFunction.ts');
      const diAutoloader = new DiAutoloader(container, mockLogger);
      await diAutoloader.load([functionPath]);

      const testFunction = diAutoloader.get<typeof TestFunction>('testFunction');

      expect(testFunction).toBeInstanceOf(Function);
      expect(testFunction()).toBe('This is a function');
    });

    it('successfully loads a class that has dependencies from a path', async () => {
      const dependenciesPath = join(FIXTURES_GLOB, PATH_GLOB_SUFFIX);

      const diAutoloader = new DiAutoloader(container, mockLogger);
      await diAutoloader.load([dependenciesPath]);

      const testClass = diAutoloader.get<TestClass>('testClass');

      expect(testClass).toBeInstanceOf(TestClass);
      expect(testClass.getData()).toBe(`here's some data`);
      expect(testClass.getBar()).toBe('bar overridden');
      expect(testClass.getFunction()).toBeInstanceOf(Function);
      expect(testClass.getFunction()()).toBe('This is a function');
    });

    it('list all modules that are present in the passed path glob', () => {
      const dependenciesPath = join(FIXTURES_GLOB, PATH_GLOB_SUFFIX);

      const diAutoloader = new DiAutoloader(container, mockLogger);
      diAutoloader.registerValue('diAutoloader', diAutoloader);

      const modules = diAutoloader.list(dependenciesPath);
      expect(modules).toHaveLength(7);
      expect(modules[0].name).toEqual('config');
      expect(modules[1].name).toEqual('routes');
      expect(modules[2].name).toEqual('config');
      expect(modules[3].name).toEqual('routes');
      expect(modules[4].name).toEqual('TestClass');
      expect(modules[5].name).toEqual('TestController');
      expect(modules[6].name).toEqual('TestFunction');
    });

    it('instantiates autoloader with a custom logger', async () => {
      const diAutoloader = new DiAutoloader(container, mockLogger);
      await diAutoloader.load([join(FIXTURES_GLOB, 'config.ts')]);
      expect(mockLogger.debug.called).toBeTruthy();
    });

    it('fails to load a dependency that does not exist', async () => {
      const diAutoloader = new DiAutoloader(container, mockLogger);
      await diAutoloader.load([join(FIXTURES_GLOB, 'config.ts')]);

      expect(() => {
        diAutoloader.get('missingDependency');
      }).toThrow();
    });
  });
});
