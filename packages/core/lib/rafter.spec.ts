import Rafter from './rafter';
import ConfigDto from './utils/ConfigDto';
import { join } from 'path';
import { IConfigLoaderService } from './utils/IConfigLoaderService';
import { mock, instance, when } from 'ts-mockito';
import ConfigLoaderService from './utils/ConfigLoaderService';

let rafter: Rafter;
const mockedConfigLoaderService: IConfigLoaderService = mock(ConfigLoaderService);
const configLoaderService: IConfigLoaderService = instance(mockedConfigLoaderService);

describe('Rafter', () => {
  beforeEach(() => {
    rafter = new Rafter({ configLoaderService });
  });

  describe('start', () => {
    it('should start the server when the dependencies are loaded', async () => {
      const config = new ConfigDto().addServices({
        server: {
          path: join(__dirname, '../test/fixtures/MyService.ts'),
          dependencies: ['logger'],
        },
      });

      when(mockedConfigLoaderService.getConfig()).thenResolve(config);

      rafter.start();
    });
  });
});
