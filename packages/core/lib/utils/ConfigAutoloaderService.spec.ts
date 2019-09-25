import { join } from 'path';
import ConfigAutoloaderService from './ConfigAutoloaderService';

const testFixturesDir = join(__dirname, '../../test/fixtures/config');
let configAutoloaderService: ConfigAutoloaderService;

describe('ConfigAutoloaderService', () => {
  describe('Get config from file', () => {
    beforeEach(() => {
      configAutoloaderService = new ConfigAutoloaderService();
    });

    it('should retrieve config from a .config file', async () => {
      const configDto = configAutoloaderService.getConfigFromFile(`${testFixturesDir}/.config.ts`);

      expect(configDto.getConfig()).toEqual({
        logger: {
          level: `debug`,
        },
      });
    });

    it('should retrieve services config from a .services file', async () => {
      const configDto = configAutoloaderService.getConfigFromFile(`${testFixturesDir}/.services.ts`);

      const services = configDto.getServices();
      expect(services.myService).toBeDefined();
      expect(services.myService.dependencies).toEqual(['logger']);
      expect(services.myService.path).toContain('MyService');
    });

    it('should retrieve middleware config from a .middleware file', async () => {
      const configDto = configAutoloaderService.getConfigFromFile(`${testFixturesDir}/.middleware.ts`);

      const middleware = configDto.getMiddleware();
      expect(middleware).toHaveLength(2);
      expect(middleware[0]).toEqual('cors');
      expect(middleware[1]).toEqual('logger');
    });

    it('should retrieve route config from a .routes file', async () => {
      const configDto = configAutoloaderService.getConfigFromFile(`${testFixturesDir}/.routes.ts`);

      const routes = configDto.getRoutes();
      expect(routes).toHaveLength(2);
      expect(routes[0])
        .toEqual({ action: 'index', controller: 'homeController', endpoint: '/', method: 'get' });
      expect(routes[1])
        .toEqual({
          action: 'index',
          controller: 'otherController',
          endpoint: '/other',
          method: 'post',
        });
    });

    it('should retrieve pre-start hook config from a .pre-start-hooks file', async () => {
      const configDto = configAutoloaderService.getConfigFromFile(`${testFixturesDir}/.pre-start-hooks.ts`);

      const hooks = configDto.getPreStartHooks();
      expect(hooks).toHaveLength(2);
      expect(hooks[0]).toEqual('dbConnect');
      expect(hooks[1]).toEqual('migration');
    });
  });

  describe('Get config from directory', () => {

  });
});
