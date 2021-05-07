import { join } from 'path';
import { FileHelper } from './FileHelper';

describe('FileHelper', () => {
  const fileHelper = new FileHelper();
  const fixturePath = join(__dirname, '../../test/fixtures');

  describe('readFile()', () => {
    [
      {
        fileName: 'simple.txt',
        expectation: 'This is a test',
      },
      {
        fileName: 'simple.json',
        expectation: `{
  "message": "test"
}
`,
      },
    ].forEach(({ fileName, expectation }) => {
      it(`should successfully read file contents from ${fileName}`, async () => {
        const text = await fileHelper.readFile(join(fixturePath, fileName));

        expect(text).toBe(expectation);
      });
    });

    it(`should fail to read file contents from a file that does not exist`, async () => {
      const fileDoesntExist = `${fixturePath}/doesntexist.txt`;

      await expect(fileHelper.readFile(fileDoesntExist)).rejects.toThrow();
    });
  });

  describe('readJsonFile()', () => {
    it(`should successfully read json file contents`, async () => {
      const jsonFile = join(fixturePath, 'simple.json');
      const json = await fileHelper.readJsonFile(jsonFile);

      expect(json).toEqual({ message: 'test' });
    });

    it(`should successfully read json file that does not exist`, async () => {
      const fileDoesntExist = `${fixturePath}/doesntexist.json`;

      await expect(fileHelper.readFile(fileDoesntExist)).rejects.toThrow();
    });
  });
});
