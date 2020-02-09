import { IDiAutoloader } from '@rafter/di-autoloader';
import MiddlewareProvider from './MiddlewareProvider';
import { ILogger } from '../../utils/logger/ILogger';
import { IMiddleware, IMiddlewareConfig } from './IMiddleware';

describe('MiddlewareProvider', () => {
  let mockDiAutoloader: IDiAutoloader;
  let mockLogger: ILogger;
  let mockMiddleware1: IMiddleware;
  let mockMiddleware2: IMiddleware;

  beforeEach(() => {
    mockDiAutoloader = ({
      get: jest.fn(),
    } as unknown) as IDiAutoloader;
    mockLogger = console;

    mockMiddleware1 = jest.fn();
    mockMiddleware2 = jest.fn();
  });

  it('should instantiate middleware collection from config', async () => {
    const config: IMiddlewareConfig[] = ['mockMiddleware1', 'mockMiddleware2'];
    mockDiAutoloader.get.mockReturnValueOnce(mockMiddleware1).mockReturnValueOnce(mockMiddleware2);

    const middlewareProvider = new MiddlewareProvider(mockDiAutoloader, mockLogger);

    const middleware = middlewareProvider.createInstance(config);

    expect(mockDiAutoloader.get.mock.calls).toHaveLength(2);
    expect(middleware).toHaveLength(2);
    expect(middleware[0]).toBe(mockMiddleware1);
  });

  it.skip('should not fail on error', () => {
  });
});
