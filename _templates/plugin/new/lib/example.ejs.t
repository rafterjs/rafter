---
to: packages/cdp-<%= h.inflection.dasherize(name) %>-plugin/lib/<%= h.inflection.titleize(name) %>Example.ts
---
import { ILogger } from '@rafterjs/logger-plugin';

import { I<%= h.inflection.titleize(name) %>Service } from 'lib/<%= h.inflection.titleize(name) %>Service';

export class <%= h.inflection.titleize(name) %>Example {
  public readonly <%= h.inflection.camelize(name) %>Service: I<%= h.inflection.titleize(name) %>Service;

  public readonly logger: ILogger;

  constructor(<%= h.inflection.camelize(name) %>Service: I<%= h.inflection.titleize(name) %>Service, logger: ILogger) {
    this.<%= h.inflection.camelize(name) %>Service = <%= h.inflection.camelize(name) %>Service;
    this.logger = logger;
  }

  public run(): void {
    const message = this.<%= h.inflection.camelize(name) %>Service.get();
    this.logger.info(message);
  }
}

export default <%= h.inflection.titleize(name) %>Example
