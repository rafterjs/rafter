import { join } from 'path';
import { diAutoloaderFactory, IDiAutoloader } from '@rafterjs/di-autoloader';
import { loggerFactory } from '@rafterjs/logger-plugin';
import { Rafter } from './Rafter';
import { PluginPathProvider, pluginPathProviderFactory } from './plugins/PluginPathProvider';
import { UuidHelper } from '../test/fixtures/override/UuidHelper';
import { TestConfig } from '../test/fixtures/full/config/config';

describe('Rafter', () => {
  let rafter: Rafter;
  let diAutoloader: IDiAutoloader;
  let pluginPathProvider: PluginPathProvider;
  // const logger: StubbedInstance<ILogger> = stubInterface<ILogger>();
  const logger = loggerFactory('', { logger: { level: 'debug' } });

  beforeAll(() => {
    diAutoloader = diAutoloaderFactory({ logger });
    pluginPathProvider = pluginPathProviderFactory({ logger });
  });

  afterAll(async () => {
    if (rafter) {
      await rafter.start();
    }
  });

  it('should autoload core dependencies and plugins when rafter starts', async () => {
    rafter = new Rafter({
      corePath: join(__dirname, '../{config,lib}/**'),
      diAutoloader,
      pluginPathProvider,
      logger,
    });

    await rafter.start();

    // core services
    expect(rafter.get('middlewareProvider')).toBeDefined();
    // plugins
    expect(rafter.get('logger')).toBeDefined();
    expect(rafter.get('dateHelper')).toBeDefined();

    await rafter.start();
  });

  it('should autoload app paths when rafter starts', async () => {
    rafter = new Rafter({
      corePath: join(__dirname, '../{config,lib}/**'),
      paths: [join(__dirname, '../test/fixtures/full/**')],
      diAutoloader,
      pluginPathProvider,
      logger,
    });

    await rafter.start();

    // core services
    expect(rafter.get('middlewareProvider')).toBeDefined();
    // plugins
    expect(rafter.get('logger')).toBeDefined();
    expect(rafter.get('dateHelper')).toBeDefined();

    // app services
    expect(rafter.get('homeController')).toBeDefined();
    expect(rafter.get('myService')).toBeDefined();

    await rafter.start();
  });

  it('should merge autoloaded configs', async () => {
    rafter = new Rafter({
      corePath: join(__dirname, '../{config,lib}/**'),
      paths: [join(__dirname, '../test/fixtures/full/**')],
      mergableFileNames: ['config'],
      diAutoloader,
      pluginPathProvider,
      logger,
    });

    await rafter.start();

    const config = rafter.get<TestConfig>('config');

    expect(config).toBeDefined();
    console.log('-------config', config);
    expect(config.logger.level).toEqual('info');
    expect(config.bar).toEqual('test something 2');
    expect(config.server.port).toEqual(2009);

    await rafter.start();
  });

  it('should override services from the app paths', async () => {
    rafter = new Rafter({
      corePath: join(__dirname, '../{config,lib}/**'),
      paths: [join(__dirname, '../test/fixtures/override/**')],
      diAutoloader,
      pluginPathProvider,
      logger,
    });

    await rafter.start();

    // overridden plugin from the app dir
    expect(rafter.get<UuidHelper>('uuidHelper').create()).toEqual('static-uuid');

    await rafter.start();
  });

  it('should not autoload services that do not contain default exports', async () => {
    rafter = new Rafter({
      corePath: join(__dirname, '../{config,lib}/**'),
      paths: [join(__dirname, '../test/fixtures/no-load/**')],
      diAutoloader,
      pluginPathProvider,
      logger,
    });

    await rafter.start();

    // overridden plugin from the app dir
    expect(() => rafter.get('nonAutoLoaded')).toThrow("Could not resolve 'nonAutoLoaded'.");

    await rafter.start();
  });
});
