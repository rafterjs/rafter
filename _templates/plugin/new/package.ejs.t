---
to: packages/cdp-<%= h.inflection.dasherize(name) %>-plugin/package.json
---
{
  "name": "@aemo/cdp-<%= name.toLowerCase() %>",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "build": "yarn clean && yarn build:index && yarn build:lib && yarn build:types",
    "build:index": "babel ./index.ts --out-dir dist --extensions .js,.jsx,.ts,.tsx --source-maps",
    "build:lib": "babel lib --out-dir dist/lib --extensions .js,.jsx,.ts,.tsx --source-maps",
    "build:types": "tsc --emitDeclarationOnly",
    "clean": "rimraf ./dist"
  },
  "description": "<%= description %>",
  "dependencies": {
    "@rafterjs/logger-plugin": "^0.4.2-alpha.3"
  },
  "devDependencies": {
    "@rafterjs/babel-preset-rafter": "^0.4.2-alpha.3",
    "@rafterjs/eslint-config": "^0.4.2-alpha.3"
  },
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "typings": "./dist/index.d.ts",
  "engines": {
    "node": ">=14"
  }
}

