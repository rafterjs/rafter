/* tslint:disable */
import Server from './Server';

describe('Common > Server', () => {
  let mockLogger;
  let mockExpress;
  let mockRouterProvider;
  let mockMiddlewareProvider;
  let mockPreStartHookProvider;
  let mockExpressListen;
  let mockServerInstance;

  beforeEach(() => {
    mockLogger = {
      log: jest.fn(),
      info: jest.fn(),
      debug: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    };

    mockExpressListen = (port, cb) => {
      cb();
      mockServerInstance = {
        close: jest.fn(),
      };
      return mockServerInstance;
    };

    mockExpress = {
      listen: jest.fn(mockExpressListen),
    };
    mockRouterProvider = jest.fn();
    mockMiddlewareProvider = jest.fn();
    mockPreStartHookProvider = jest.fn();
  });

  it(`successfully starts the server with no routes, middleware or pre-start hooks`, async () => {
    const server = Server(
      mockExpress,
      mockRouterProvider,
      mockMiddlewareProvider,
      mockPreStartHookProvider,
      [],
      [],
      [],
      3000,
      mockLogger,
    );

    await server.start();
    expect(mockExpress.listen.mock.calls.length).toBe(1);
  });

  it(`successfully stops the server after it has been started`, async () => {
    const server = Server(
      mockExpress,
      mockRouterProvider,
      mockMiddlewareProvider,
      mockPreStartHookProvider,
      [],
      [],
      [],
      3000,
      mockLogger,
    );

    await server.start();
    expect(mockExpress.listen.mock.calls.length).toBe(1);
    await server.stop();
    expect(mockServerInstance.close.mock.calls.length).toBe(1);
  });

  xit(`successfully starts the server with with routes`, async () => {
    const server = Server(
      mockExpress,
      mockRouterProvider,
      mockMiddlewareProvider,
      mockPreStartHookProvider,
      [],
      [],
      [],
      3000,
      mockLogger,
    );

    await server.start();
    expect(mockExpress.listen.mock.calls.length).toBe(1);
  });

  xit(`successfully starts the server with with middleware`, async () => {
    const server = Server(
      mockExpress,
      mockRouterProvider,
      mockMiddlewareProvider,
      mockPreStartHookProvider,
      [],
      [],
      [],
      3000,
      mockLogger,
    );

    await server.start();
    expect(mockExpress.listen.mock.calls.length).toBe(1);
  });

  xit(`successfully starts the server with with pre-start hooks`, async () => {
    const server = Server(
      mockExpress,
      mockRouterProvider,
      mockMiddlewareProvider,
      mockPreStartHookProvider,
      [],
      [],
      [],
      3000,
      mockLogger,
    );

    await server.start();
    expect(mockExpress.listen.mock.calls.length).toBe(1);
  });
});
