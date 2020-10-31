# Rafter changelog

## 2019/12/14

- Added nodemon for build watching on core. Helps when running boilerplate in dev mode since core et al are symlinked.
- Split the config loading up into another service so that it can be tested. The `rafter` service was trying to do too much before.
