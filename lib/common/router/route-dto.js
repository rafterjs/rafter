/**
 *
 */
export default class RouteDto {
    /**
     * @param {String} method
     * @param {String} endpoint
     * @param {Function} controller
     */
    constructor(method, endpoint, controller) {
        this._method = method;
        this._endpoint = endpoint;
        this._controller = controller;
    }

    /**
     * @inheritDoc
     */
    getEndpoint() {
        return this._endpoint;
    }

    /**
     * @inheritDoc
     */
    getController() {
        return this._controller;
    }

    /**
     * @inheritDoc
     */
    getMethod() {
        return this._method;
    }
}
