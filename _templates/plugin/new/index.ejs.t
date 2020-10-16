---
to: packages/cdp-<%= h.inflection.dasherize(name) %>-plugin/index.ts
---
export * from './lib/<%= h.inflection.titleize(name) %>Service';
export * from './lib/<%= h.inflection.titleize(name) %>Example';
