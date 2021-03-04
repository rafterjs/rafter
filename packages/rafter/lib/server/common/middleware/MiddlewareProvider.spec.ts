import { IDiAutoloader } from '@rafterjs/di-autoloader';
import { ILogger, ILoggerFactory } from '@rafterjs/logger-plugin';
import sinon, { StubbedInstance, stubInterface } from 'ts-sinon';
import { IMiddleware, IMiddlewareConfig, IMiddlewares } from './IMiddleware';
import MiddlewareProvider from './MiddlewareProvider';

describe('MiddlewareProvider', () => {
  let mockDiAutoloader: StubbedInstance<IDiAutoloader>;
  let mockLogger: StubbedInstance<ILogger>;
  let mockLoggerFactory: StubbedInstance<ILoggerFactory>;
  let mockMiddleware1: IMiddleware;
  let mockMiddleware2: IMiddleware;

  beforeEach(() => {
    mockDiAutoloader = stubInterface<IDiAutoloader>();
    mockLogger = stubInterface<ILogger>();
    mockLoggerFactory = () => mockLogger;

    mockMiddleware1 = sinon.stub();
    mockMiddleware2 = sinon.stub();
  });

  it('should instantiate middleware collection from config', async () => {
    const config: IMiddlewares = new Set<IMiddlewareConfig>(['mockMiddleware1', 'mockMiddleware2']);
    mockDiAutoloader.get.withArgs('mockMiddleware1').returns(mockMiddleware1);
    mockDiAutoloader.get.withArgs('mockMiddleware2').returns(mockMiddleware2);

    const middlewareProvider = new MiddlewareProvider(mockDiAutoloader, mockLoggerFactory);

    const middleware = middlewareProvider.createInstance(config);

    expect(mockDiAutoloader.get.calledTwice).toBeTruthy();
    expect(middleware).toHaveLength(2);
    expect(middleware[0]).toBe(mockMiddleware1);
  });
});
