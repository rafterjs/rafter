/**
 * An extension of the javascript error class for http errors.
 *
 */
export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }

  /**
   * The http status code.
   *
   * @returns {Number}
   */
  getStatus(): number {
    return this.status;
  }

  /**
   * The http error message
   *
   * @returns {String}
   */
  getMessage(): string {
    return this.message;
  }
}
