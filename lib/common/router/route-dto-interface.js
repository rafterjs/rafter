/**
 * @interface
 */
export default class RouteDtoInterface {
    constructor() {
        /* istanbul ignore if  */
        if (this.constructor === RouteDtoInterface) {
            throw new Error(`Constructing an interface is not allowed: ${this.constructor}`);
        }
    }

    /**
     * @returns {String}
     */
    getEndpoint() {
        /* istanbul ignore next */
        throw new Error(`The get getEndpoint method needs to be implemented`);
    }

    /**
     * @returns {String}
     */
    getMethod() {
        /* istanbul ignore next */
        throw new Error(`The get getMethod method needs to be implemented`);
    }

    /**
     * @returns {Function}
     */
    getController() {
        /* istanbul ignore next */
        throw new Error(`The get getController method needs to be implemented`);
    }
}
