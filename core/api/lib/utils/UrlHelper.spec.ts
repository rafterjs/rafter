import { mockLoggerFactory } from '@rafterjs/test';
import { StubbedInstance, stubInterface } from 'ts-sinon';
import { IRequest } from 'rafter';
import { UrlHelper } from './UrlHelper';

describe('UuidHelper', () => {
  let urlHelper: UrlHelper;

  beforeEach(() => {
    urlHelper = new UrlHelper(mockLoggerFactory);
  });

  describe('getSelf()', () => {
    it(`should successfully return the current url`, async () => {
      const mockRequest: StubbedInstance<IRequest> = stubInterface<IRequest>();

      mockRequest.protocol = 'http';
      mockRequest.originalUrl = '/hello';
      mockRequest.get.returns('localhost:5000');

      const url = urlHelper.getSelf(mockRequest);
      expect(url).toBeDefined();
      expect(url).toEqual('http://localhost:5000/hello');
    });
  });
});
