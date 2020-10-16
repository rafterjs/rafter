---
to: packages/cdp-<%= h.inflection.dasherize(name) %>-plugin/lib/<%= h.inflection.titleize(name) %>Service.ts
---

export interface I<%= h.inflection.titleize(name) %>Service {
  get(): string;
}

export class <%= h.inflection.titleize(name) %>Service {
  public get(): string {
    return `I'm a service called "<%= h.inflection.titleize(name) %>" that has been injected automatically into the example`;
  }
}

export default <%= h.inflection.titleize(name) %>Service
