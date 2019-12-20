import { join } from 'path';
import { instance, mock, when } from 'ts-mockito';
import Rafter from './rafter';
import DiConfigDto from './utils/config/DiConfigDto';
import DiConfigLoaderService from './utils/config/DiConfigLoaderService';
import { IDiConfigLoaderService } from './utils/config/IDiConfigLoaderService';

let rafter: Rafter;
const mockedDiConfigLoaderService: IDiConfigLoaderService = mock(DiConfigLoaderService);
const diConfigLoaderService: IDiConfigLoaderService = instance(mockedDiConfigLoaderService);

describe('Rafter', () => {
  beforeEach(() => {
    rafter = new Rafter({ diConfigLoaderService });
  });

  describe('start', () => {
    it('should start the server when the dependencies are loaded', async () => {
      const config = new DiConfigDto().addServices({
        server: {
          path: join(__dirname, '../test/fixtures/MyService.ts'),
          dependencies: ['logger'],
        },
      });

      when(mockedDiConfigLoaderService.getDiConfig()).thenResolve(config);

      rafter.start();
    });
  });
});
