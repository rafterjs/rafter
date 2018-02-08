import ImplementationRequiredError from '../errors/interface/implementation-required-error';
import InstantiationError from '../errors/interface/instantiation-error';

export default class TransformerInterface {
    constructor() {
        if (this.constructor === TransformerInterface) {
            throw new InstantiationError(`EmailNotificationRequestInterface`);
        }
    }

    convert(source) {
        throw new ImplementationRequiredError(`TransformerInterface::convert ${source}`);
    }
}
