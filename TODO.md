# Rafter TODO

- [x] Monorepo to handle core and other dependencies
- [x] A babel preset package
- [x] An eslint preset package
- [x] A plugin architecture
- [x] Convert all packages to Typescript
- [ ] "create react app" style boilerplate
- [x] Example of middleware being autoloaded
- [x] Example of a "simple" app with autoloading
- [x] Example of an api with autoloading
- [ ] Create an openapi plugin for @rafterjs/api
- [ ] Create a serverless / aws lamda version of rafter
- [ ] Example of a "modern" app eg using React, GraphQL Api
- [ ] Create CI pipelines for PRs
- [ ] Create CI pipelines for docs releases
- [ ] Enhancement: Create cached dist file for DI autoloading

### Smaller tasks

- [x] Convert the babel package to js. This is because babel is missing types which is causing errors.
- [x] share the same logger instance from rafter into DI
- [ ] Create tests for existing services in CORE
- [x] Fix config merging
- [ ] Disambiguate DI `config` from plugin or app `config`
- [x] Add plugin logging back into the Rafter start up
- [x] Create a PR for the major TS refactor
- [x] Remove the `awilix` dependency in `boilerplate`
