import { Status } from '../response';

export class HttpError extends Error {
  public readonly status: Status;

  constructor(status: Status, message: string) {
    super(message);
    this.status = status;
  }

  public getStatus(): Status {
    return this.status;
  }

  public getMessage(): string {
    return this.message;
  }
}
