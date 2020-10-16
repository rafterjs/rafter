---
to: packages/cdp-<%= h.inflection.dasherize(name) %>-plugin/tsconfig.json
---
{
  "extends": "./../../tsconfig",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["./lib", "./index.ts"],
  "exclude": ["./test", "./**/*.spec.ts"]
}
