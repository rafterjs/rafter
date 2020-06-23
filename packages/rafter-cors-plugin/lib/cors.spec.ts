import corsFactory from './cors';

describe('cors', () => {
  it('should return a middleware with cors', async () => {
    const corsMiddleware = corsFactory({}, console);

    expect(corsMiddleware).toBeInstanceOf(Function);
  });
});
