import { Status } from '../response';
import { HttpError } from './HttpError';

export class ForbidenError extends HttpError {
  constructor(message = `Forbidden`) {
    super(Status.FORBIDDEN, message);
  }
}
