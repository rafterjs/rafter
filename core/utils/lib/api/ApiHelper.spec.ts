import { IRequestMethod, mockLoggerFactory, StubServer } from '@rafterjs/test';
import { ApiHelper } from './ApiHelper';

describe('ApiHelper', () => {
  let stubServer: StubServer;
  let apiHelper: ApiHelper;

  beforeAll(async () => {
    stubServer = new StubServer(
      {
        host: 'localhost',
        apiPort: 6000,
        adminPort: 6001,
      },
      mockLoggerFactory,
    );

    await stubServer.start();
  });

  afterAll(async () => {
    if (stubServer) {
      await stubServer.stop();
    }
  });

  beforeEach(async () => {
    apiHelper = new ApiHelper(mockLoggerFactory);
    if (stubServer) {
      await stubServer.deleteAll();
    }
  });

  describe('get()', () => {
    it(`should successfully return a valid get request`, async () => {
      // create stub response
      const data = {
        data: {
          id: '1',
        },
        message: 'test',
      };
      await stubServer.add({
        request: {
          url: '/test',
        },
        response: {
          body: JSON.stringify(data),
        },
      });

      const response = await apiHelper.get<typeof data>('http://localhost:6000/test');
      expect(response).toBeDefined();
      expect(response.data.data).toEqual({ id: '1' });
      expect(response.data.message).toEqual('test');
    });
  });

  describe('delete()', () => {
    it(`should successfully return a valid delete request`, async () => {
      await stubServer.add({
        request: {
          url: '/test',
          method: IRequestMethod.DELETE,
        },
        response: {
          status: 201,
        },
      });

      const response = await apiHelper.delete('http://localhost:6000/test');
      expect(response).toBeDefined();
      expect(response.status).toEqual(201);
    });
  });
});
