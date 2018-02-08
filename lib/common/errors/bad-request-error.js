import HttpError from './http-error';
import {STATUS} from '../helpers/response-constants';

export default class BadRequestError extends HttpError {
    constructor(message = `Bad Request`) {
        super(STATUS.CLIENT_ERROR.BAD_REQUEST, message);
    }
}
