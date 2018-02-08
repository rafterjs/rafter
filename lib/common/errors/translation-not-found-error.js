import HttpError from './http-error';
import {STATUS} from '../helpers/response-constants';

/**
 * Throws an error when the translation files for a requested locale do not exist.
 */
export default class TranslationNotFoundError extends HttpError {
    constructor(message = `Not found`) {
        super(STATUS.CLIENT_ERROR.PAGE_NOT_FOUND, message);
    }
}
