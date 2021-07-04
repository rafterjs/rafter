import { ILogger } from '@rafterjs/logger-plugin';
import { stubInterface } from 'ts-sinon';
import { join } from 'path';
import { PluginPathProvider } from './PluginPathProvider';

describe('PluginPathProvider', () => {
  const mockLogger = stubInterface<ILogger>();

  describe('getPath', () => {
    it('successfully get the path of the passed plugin', async () => {
      const pluginPathProvider = new PluginPathProvider(mockLogger);

      const path = await pluginPathProvider.getPath('@rafterjs/logger-plugin');

      expect(path).toContain(join('/plugins/logger/dist/**'));
    });
  });
});
