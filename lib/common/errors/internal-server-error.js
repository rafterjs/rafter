import HttpError from './http-error';
import {STATUS} from '../helpers/response-constants';

/**
 * Throws an error when the user does not have access.
 */
export default class InternalServerError extends HttpError {
    constructor(message = `The server encountered an unexpected problem`) {
        super(STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR, message);
    }
}
