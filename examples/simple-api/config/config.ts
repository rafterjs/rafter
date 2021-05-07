import { IServerConfig } from '@rafterjs/api';

export type SimpleExampleApiConfig = IServerConfig & {
  api: {
    version: string;
  };
};

export default async (): Promise<SimpleExampleApiConfig> => {
  return {
    server: {
      port: 4000,
    },
    api: {
      version: '1.0.0',
    },
  };
};
