import { Status } from '../response';
import { HttpError } from './HttpError';

export class BadGatewayError extends HttpError {
  constructor(message = `Bad gateway`) {
    super(Status.BAD_GATEWAY, message);
  }
}
