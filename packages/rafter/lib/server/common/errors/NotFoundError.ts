import { Status } from '../response';
import { HttpError } from './HttpError';

export class NotFoundError extends HttpError {
  constructor(message = `The resource is not found`) {
    super(Status.NOT_FOUND, message);
  }
}
