export default class InstantiationError extends Error {
    constructor(message) {
        super(`Constructing an interface is not allowed: ${message}`);
    }
}
