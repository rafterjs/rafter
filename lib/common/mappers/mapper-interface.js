import ImplementationRequiredError from '../errors/interface/implementation-required-error';
import InstantiationError from '../errors/interface/instantiation-error';

export default class MapperInterface {
    constructor() {
        if (this.constructor === MapperInterface) {
            throw new InstantiationError(`MapperInterface`);
        }
    }

    map(source, target) {
        throw new ImplementationRequiredError(`MapperInterface::convert ${source}, ${target}`);
    }
}
