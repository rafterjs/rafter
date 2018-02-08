/**
 * An extension of the javascript error class for http errors.
 *
 */
export default class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }

    /**
     * The http status code.
     *
     * @returns {Number}
     */
    getStatus() {
        return this.status;
    }

    /**
     * The http error message
     *
     * @returns {String}
     */
    getMessage() {
        return this.message;
    }
}
