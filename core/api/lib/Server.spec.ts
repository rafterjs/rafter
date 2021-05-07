import { ILogger } from '@rafterjs/logger-plugin';
import { StubbedInstance, stubInterface } from 'ts-sinon';
import { Server } from './Server';

describe('Server', () => {
  const logger: StubbedInstance<ILogger> = stubInterface<ILogger>();
  let server: Server;

  beforeEach(() => {
    server = new Server([], logger);
  });

  describe('start()', () => {
    it(`should successfully start the rafter server with default paths`, async () => {
      await server.start();
      expect(server).toBeDefined();
    });
  });
});
