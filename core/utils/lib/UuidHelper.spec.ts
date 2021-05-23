import { UuidHelper } from './UuidHelper';

describe('UuidHelper', () => {
  let uuidHelper: UuidHelper;

  beforeEach(() => {
    uuidHelper = new UuidHelper();
  });

  describe('create()', () => {
    it(`should successfully return a valid uuid`, async () => {
      const uuid = uuidHelper.create();
      expect(uuid).toBeDefined();
    });
  });
});
