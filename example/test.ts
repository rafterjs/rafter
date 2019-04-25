
const babel = require('../babel.config');

require("@babel/register")({
  extensions: [".js", ".jsx", ".ts", ".tsx"],
  presets: babel.presets,
  plugins: babel.plugins
});

require('./test1');