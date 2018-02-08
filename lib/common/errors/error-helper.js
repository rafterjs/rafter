import HttpError from './http-error';
import InternalServerError from './internal-server-error';

/**
 * A helper for errors
 */
export default class ErrorHelper {
    /**
     * Normalizes the error message into a concrete {@link HttpError}.
     *
     * This helps with returning error codes and messages.
     *
     * @param {HttpError|Error} err
     * @return {HttpError}
     */
    normalizeError(err) {
        if (err instanceof HttpError) {
            return err;
        }

        return new InternalServerError(err.message);
    }
}
