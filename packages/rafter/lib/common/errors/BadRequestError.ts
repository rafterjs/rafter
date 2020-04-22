import { HttpError } from './HttpError';
import { STATUS } from '../helpers';

export class BadRequestError extends HttpError {
  constructor(message = `Bad Request`) {
    super(STATUS.CLIENT_ERROR.BAD_REQUEST, message);
  }
}
