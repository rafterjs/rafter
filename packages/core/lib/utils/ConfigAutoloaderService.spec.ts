import { join } from 'path';
import ConfigAutoloaderService from './ConfigAutoloaderService';

const testFixturesDir = join(__dirname, '../../test/fixtures/config');
let configAutoloaderService: ConfigAutoloaderService;

describe('Default options', () => {
  beforeEach(() => {
    configAutoloaderService = new ConfigAutoloaderService();
  });

  it('should retrieve config from a file', async () => {
    const configDto = configAutoloaderService.getConfigFromFile(`${testFixturesDir}/.config.ts`);

    expect(configDto.getConfig()).toEqual({
      logger: {
        level: `debug`,
      },
    });
  });
});
