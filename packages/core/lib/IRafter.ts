export default interface IRafter {
  start(): Promise<void>;

  stop(): Promise<void>;
}
