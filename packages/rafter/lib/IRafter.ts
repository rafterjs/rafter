export interface IRafter {
  start(): Promise<void>;

  stop(): Promise<void>;

  get<T>(serviceName: string): Promise<T>;
}
