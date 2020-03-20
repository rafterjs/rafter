import { join } from 'path';
import { instance, mock, when } from 'ts-mockito';
import Rafter from './rafter';
import DiConfigDto from './utils/loader/DiConfigDto';
import DiConfigLoaderService from './utils/loader/DiConfigLoaderService';
import { IDiConfigLoaderService } from './utils/loader/IDiConfigLoaderService';

let rafter: Rafter;
const mockedDiConfigLoaderService: IDiConfigLoaderService = mock(DiConfigLoaderService);

describe.skip('Rafter', () => {
  beforeEach(() => {
    rafter = new Rafter({ paths: [] });
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
