import { mockLoggerFactory } from '@rafterjs/test';
import { UuidHelper } from '@rafterjs/utils';
import sinon, { StubbedInstance, stubConstructor, stubInterface } from 'ts-sinon';
import { IMiddleware, IRequest, IResponse } from 'rafter';
import { HttpContextHelper } from '../utils';
import { correlationIdMiddleware } from './CorrelationIdMiddleware';
import { RequestHelper } from './RequestHelper';

describe('CorrelationIdMiddleware', () => {
  let mockHttpContextHelper: StubbedInstance<HttpContextHelper>;
  let mockRequestHelper: StubbedInstance<RequestHelper>;
  let mockUuidHelper: StubbedInstance<UuidHelper>;
  let middleware: IMiddleware;
  let mockRequest: StubbedInstance<IRequest>;
  let mockResponse: StubbedInstance<IResponse>;

  beforeEach(() => {
    mockHttpContextHelper = stubConstructor(HttpContextHelper);
    mockRequestHelper = stubConstructor(RequestHelper);
    mockUuidHelper = stubConstructor(UuidHelper);
    middleware = correlationIdMiddleware(mockHttpContextHelper, mockRequestHelper, mockUuidHelper, mockLoggerFactory);
    mockRequest = stubInterface<IRequest>();
    mockResponse = stubInterface<IResponse>();
  });

  describe('correlationIdMiddleware()', () => {
    it('should successfully set a correlation id on the request context when doesnt exist on a header', async () => {
      const done = sinon.stub();
      mockUuidHelper.create.returns('0bd7ece0-ba06-4cbd-a207-4517d8ef0ead');
      mockRequestHelper.getTransactionIdFromHeader.returns(undefined);

      await middleware(mockRequest, mockResponse, done);

      expect(done.calledOnce).toBeTruthy();
      expect(mockUuidHelper.create.calledOnce).toBeTruthy();
      expect(
        mockHttpContextHelper.setTransactionId.withArgs('0bd7ece0-ba06-4cbd-a207-4517d8ef0ead').calledOnce,
      ).toBeTruthy();
    });

    it('should successfully set a correlation id on the request context when it exists on a header', async () => {
      const done = sinon.stub();
      mockUuidHelper.create.returns('0bd7ece0-ba06-4cbd-a207-4517d8ef0ead');
      mockRequestHelper.getTransactionIdFromHeader.returns('ae27e7cf-84bc-48ac-b5fa-c5c068571381');

      await middleware(mockRequest, mockResponse, done);

      expect(done.calledOnce).toBeTruthy();
      expect(mockUuidHelper.create.notCalled).toBeTruthy();
      expect(
        mockHttpContextHelper.setTransactionId.withArgs('ae27e7cf-84bc-48ac-b5fa-c5c068571381').calledOnce,
      ).toBeTruthy();
    });
  });
});
