/**
 * NOTE: this is to register babel before running typescript files.
 */
require("@babel/register")({
  extensions: [".js", ".jsx", ".ts", ".tsx"],
  presets: [["@origin-digital/babel-preset", { modules: "commonjs" }]]
});
