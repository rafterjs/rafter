import { IDiContainer } from '@rafter/di-container';
import MiddlewareProvider from './MiddlewareProvider';
import { ILogger } from '../../utils/ILogger';
import { IMiddleware, IMiddlewareConfig } from './IMiddleware';

describe('MiddlewareProvider', () => {
  let mockDiContainer: IDiContainer;
  let mockLogger: ILogger;
  let mockMiddleware1: IMiddleware;
  let mockMiddleware2: IMiddleware;

  beforeEach(() => {
    mockDiContainer = ({
      get: jest.fn(),
    } as unknown) as IDiContainer;
    mockLogger = console;

    mockMiddleware1 = jest.fn();
    mockMiddleware2 = jest.fn();
  });

  it('should instantiate middleware collection from config', async () => {
    const config: IMiddlewareConfig[] = ['mockMiddleware1', 'mockMiddleware2'];
    mockDiContainer.get.mockReturnValueOnce(mockMiddleware1).mockReturnValueOnce(mockMiddleware2);

    const middlewareProvider = new MiddlewareProvider(mockDiContainer, mockLogger);

    const middleware = middlewareProvider.createInstance(config);

    expect(mockDiContainer.get.mock.calls).toHaveLength(2);
    expect(middleware).toHaveLength(2);
    expect(middleware[0]).toBe(mockMiddleware1);
  });

  it.skip('should not fail on error', () => {});
});
