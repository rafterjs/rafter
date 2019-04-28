const babel = require('../../babel.config');

const plugins = [...babel.plugins, ['@babel/plugin-proposal-decorators', { legacy: true }]];
module.exports = { presets: babel.presets, plugins };
