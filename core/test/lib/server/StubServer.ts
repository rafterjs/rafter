import { ILogger, ILoggerFactory } from '@rafterjs/logger-plugin';
import fetch from 'node-fetch';
// @ts-ignore
import { Stubby } from 'stubby';

// eslint-disable-next-line no-shadow
export enum IRequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export type IStubRequest = {
  url: string;
  headers?: Record<string, string>;
  query?: Record<string, string>;
  method?: IRequestMethod;
  post?: string;
  file?: string;
};

export type IStubResponse = {
  headers?: Record<string, string>;
  status?: number;
  latency?: number;
  file?: string;
  body?: string;
};

export type IStub = {
  request: IStubRequest;
  response?: IStubResponse;
};

export type StubServerOptions = {
  host: string;
  apiPort: number;
  adminPort: number;
};

export class StubServer {
  private readonly logger: ILogger;

  private readonly stubby: typeof Stubby;

  constructor(private readonly options: StubServerOptions, private readonly loggerFactory: ILoggerFactory) {
    this.stubby = new Stubby();
    this.logger = loggerFactory('StubServer');
  }

  public async start(): Promise<void> {
    const { apiPort, adminPort, host } = this.options;
    this.logger.info(`EmdmApiStub::start Starting stub server: 
      Stub: ${host}:${apiPort}
      Admin: ${host}:${apiPort}
    `);

    return new Promise((resolve, reject) => {
      this.stubby.start(
        {
          stubs: apiPort,
          admin: adminPort,
          location: host,
        },
        (errors?: Error[]) => {
          if (errors) {
            reject(errors);
          } else {
            resolve();
          }
        },
      );
    });
  }

  public async stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.stubby.stop((errors?: Error[]) => {
        if (errors) {
          reject(errors);
        } else {
          resolve();
        }
      });
    });
  }

  public async add(stub: IStub): Promise<void> {
    this.logger.debug(`Adding the following stub: `, stub);

    await fetch(this.getAdminUrl(), {
      method: IRequestMethod.POST,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stub),
    });
  }

  public async delete(id: string): Promise<void> {
    this.logger.debug(`Deleting the stub with the id: ${id}`);

    await fetch(`${this.getAdminUrl()}/${id}`, {
      method: IRequestMethod.DELETE,
    });
  }

  public async deleteAll(): Promise<void> {
    this.logger.debug(`Deleting all stub data`);

    await fetch(this.getAdminUrl(), {
      method: IRequestMethod.DELETE,
    });
  }

  private getAdminUrl(): string {
    const { host, adminPort } = this.options;
    return `http://${host}:${adminPort}`;
  }
}
