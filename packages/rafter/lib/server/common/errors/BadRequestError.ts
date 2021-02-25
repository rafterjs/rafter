import { Status } from '../response';
import { HttpError } from './HttpError';

export class BadRequestError extends HttpError {
  constructor(message = `Bad Request`) {
    super(Status.BAD_REQUEST, message);
  }
}
