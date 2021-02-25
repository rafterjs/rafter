import { Status } from '../response';
import { HttpError } from './HttpError';

export class ForbiddenError extends HttpError {
  constructor(message = `Forbidden`) {
    super(Status.FORBIDDEN, message);
    this.name = 'Forbidden';
  }
}
