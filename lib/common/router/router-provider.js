/**
 * A provider that creates new router instances
 */
export default class RouterProvider {
    constructor(express) {
        this._express = express;
    }

    /**
     * Creates a new router instance.
     *
     * @return {object}
     */
    createInstance() {
        return this._express.Router();
    }
}
