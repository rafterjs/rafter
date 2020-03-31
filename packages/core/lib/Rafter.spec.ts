import { join } from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createStubInstance } from 'sinon';
import { LoggingService } from '@rafter/utils';
import diAutoloaderFactory, { IDiAutoloader } from '@rafter/di-autoloader';
import Rafter from './Rafter';

jest.mock('@rafter/utils');

describe('Rafter', () => {
  const mockLogger = createStubInstance(LoggingService);
  const diAutoloader: IDiAutoloader = diAutoloaderFactory({ logger: mockLogger });

  it('starts the rafter server with all the dependencies', async () => {
    const appPath = join(__dirname, '../test/fixtures/full/**', '*.ts');

    const rafter = new Rafter({
      diAutoloader,
      paths: [appPath],
      logger: mockLogger,
    });

    await rafter.start();
  });
});
