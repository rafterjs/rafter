export type IServerConfig = {
  server: {
    ssl?: {
      enabled?: boolean;
      certificate?: string;
      privateKey?: string;
      password?: string;
    };
    port?: number;
  };
};
