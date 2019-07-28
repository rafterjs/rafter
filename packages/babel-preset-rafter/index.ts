import { declare } from '@babel/helper-plugin-utils';
import presetEnv from '@babel/preset-env';
import classPropertiesPlugin from '@babel/plugin-proposal-class-properties';
import spreadPlugin from '@babel/plugin-proposal-object-rest-spread';
import importPlugin from '@babel/plugin-syntax-dynamic-import';
import typescriptPreset from '@babel/preset-typescript';

const presets = [
  [
    presetEnv,
    {
      targets: {
        node: '9',
      },
    },
  ],
];

const plugins = [classPropertiesPlugin, spreadPlugin, importPlugin];

export default declare((api, { typescript = false }) => {
  if (typescript) {
    presets.push(typescriptPreset);
  }

  return {
    presets,
    plugins,
  };
});
