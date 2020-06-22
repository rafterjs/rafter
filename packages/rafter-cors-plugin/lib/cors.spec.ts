import cors from './cors';

describe('cors', () => {
  it('should return a cors request', async () => {
    const corsMiddleware = cors({}, console);
  });
});
