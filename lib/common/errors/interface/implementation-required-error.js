export default class InterfaceImplementationRequiredError extends Error {
    constructor(message) {
        super(`Implementation required for ${message}`);
    }
}
