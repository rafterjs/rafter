import { readFileSync, writeFileSync } from 'fs';

export class FileHelper {
  public async readFile(
    filename: string,
    options: { encoding: BufferEncoding } = { encoding: 'utf8' },
  ): Promise<string> {
    return readFileSync(filename, options);
  }

  public async writeFile(
    filename: string,
    data: string,
    options: { encoding: BufferEncoding } = { encoding: 'utf8' },
  ): Promise<void> {
    return writeFileSync(filename, data, options);
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
