import {HttpError} from './HttpError';
import {STATUS} from '../helpers/ResponseConstants';

/**
 * Throws an error when the user does not have access.
 */
export class InternalServerError extends HttpError {
  constructor(message = `The server encountered an unexpected problem`) {
    super(STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR, message);
  }
}
