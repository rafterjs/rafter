import InstantiationError from '../errors/interface/instantiation-error';
import InterfaceImplementationRequiredError from '../errors/interface/implementation-required-error';

class RendererServiceInterface {
    constructor() {
        /* istanbul ignore if  */
        if (this.constructor === RendererServiceInterface) {
            throw new InstantiationError();
        }
    }

    /**
     * @param {express.Response} req
     * @param {express.Request} res
     * @param {ResponseDto} response
     * @return {Promise.<void>}
     */
    async render(req, res, response) {
        throw new InterfaceImplementationRequiredError(
            `Implementation required for render: ${req}, ${res}, ${response}`
        );
    }

    /**
     * @param {express.Response} req
     * @param {express.Request} res
     * @param {Error|string} error
     * @return {Promise.<void>}
     */
    async renderError(req, res, error) {
        throw new InterfaceImplementationRequiredError(
            `Implementation required for renderError: ${req}, ${res}, ${error}`
        );
    }
}

export default RendererServiceInterface;
