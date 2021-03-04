import { Status } from '../response';
import { HttpError } from './HttpError';

export class InternalServerError extends HttpError {
  constructor(message = `The server encountered an unexpected problem`) {
    super(Status.INTERNAL_SERVER_ERROR, message);
    this.name = 'Internal Server Error';
  }
}
