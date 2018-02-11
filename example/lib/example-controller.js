/**
 * This is just a test controller
 */
export default class ExampleController {
    constructor(message) {
        this._message = message;
    }

    /**
     * @param {express.Request} req
     * @param {express.Response} res
     */
    index(req, res) {
        res.send(
            this._getMessage()
        );
    }

    /**
     * @return {string}
     * @private
     */
    _getMessage() {
        return this._message;
    }
}
