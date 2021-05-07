import { readFile, writeFile } from 'fs/promises';

export class FileHelper {
  public async readFile(
    filename: string,
    options: { encoding: BufferEncoding } = { encoding: 'utf8' },
  ): Promise<string> {
    return readFile(filename, options);
  }

  public async writeFile(
    filename: string,
    data: string,
    options: { encoding: BufferEncoding } = { encoding: 'utf8' },
  ): Promise<void> {
    return writeFile(filename, data, options);
  }

  public async readJsonFile<T extends Record<string, unknown>>(filename: string): Promise<T> {
    const json = await this.readFile(filename);
    return JSON.parse(json);
  }
}

export const fileHelperFactory = (): FileHelper => {
  return new FileHelper();
};

export default FileHelper;
