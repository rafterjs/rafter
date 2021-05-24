import { mockLogger, mockLoggerFactory } from '@rafterjs/test';
import sinon, { StubbedInstance, stubInterface } from 'ts-sinon';
import { IMiddleware, IRequest, IResponse } from 'rafter';
import requestLoggerMiddlewareFactory from './RequestLoggerMiddleware';

describe('RequestLoggerMiddleware', () => {
  let middleware: IMiddleware;
  let mockRequest: StubbedInstance<IRequest>;
  let mockResponse: StubbedInstance<IResponse>;

  beforeEach(() => {
    middleware = requestLoggerMiddlewareFactory(mockLoggerFactory);
    mockRequest = stubInterface<IRequest>();
    mockResponse = stubInterface<IResponse>();
  });

  describe('requestLoggerMiddleware()', () => {
    it(`should successfully log each request`, async () => {
      mockRequest.method = 'GET';
      mockRequest.protocol = 'https';
      mockRequest.get.withArgs('host').returns('rafterjs.com.au');
      mockRequest.originalUrl = '/about';

      const done = sinon.stub();
      await middleware(mockRequest, mockResponse, done);

      expect(done.calledOnce).toBeTruthy();
      expect(mockLogger.info.calledOnce).toBeTruthy();
      const log = mockLogger.info.args[0][0];

      expect(log).toEqual('GET https://rafterjs.com.au/about');
    });
  });
});
