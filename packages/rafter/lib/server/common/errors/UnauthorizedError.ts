import { Status } from '../response';
import { HttpError } from './HttpError';

export class UnauthorizedError extends HttpError {
  constructor(message = `Unauthorized`) {
    super(Status.UNAUTHORIZED, message);
  }
}
