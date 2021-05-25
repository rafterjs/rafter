# Rafter TODO

- [x] Monorepo to handle core and other dependencies
- [x] A babel preset package
- [x] An eslint preset package
- [x] A plugin architecture
- [x] Convert all packages to Typescript
- [x] Example of middleware being autoloaded
- [x] Example of a "simple" app with autoloading
- [x] Example of an api with autoloading
- [x] Create @rafterjs/function ie. executes a single function with di
- [ ] Load plugins recursively including configs
- [ ] Create an aws lamda example of @rafterjs/lambda
- [ ] Example of a "modern" app eg using React, GraphQL Api
- [ ] Create an openapi plugin for @rafterjs/api
- [ ] Create CI pipelines for PRs
- [ ] Create CI pipelines for docs releases
- [ ] Enhancement: Create cached dist file for DI autoloading

### Smaller tasks

- [x] Convert the babel package to js. This is because babel is missing types which is causing errors.
- [x] share the same logger instance from rafter into DI
- [x] Fix config merging
- [x] Add plugin logging back into the Rafter start up
- [x] Create a PR for the major TS refactor
- [x] Remove the `awilix` dependency in `boilerplate`
- [ ] Create tests for existing services in CORE
- [ ] Disambiguate DI `config` from plugin or app `config`
- [ ] Restructure code into core, examples and plugins
- [x] Create a default export for @rafterjs/api
