import Rafter from './rafter';

let rafter: Rafter;

describe('rafter', () => {
  it('should retrieve services config from a .services file', async () => {
    const test = {};
    expect(test).toContain('MyService');
  });
});
