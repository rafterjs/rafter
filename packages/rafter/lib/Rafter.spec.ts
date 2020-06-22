import { join } from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createStubInstance } from 'sinon';
import { LoggingService } from '@rafterjs/logger-plugin';
import diAutoloaderFactory, { IDiAutoloader } from '@rafterjs/di-autoloader';
import Rafter from './Rafter';

jest.mock('@rafterjs/logger-plugin');

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
