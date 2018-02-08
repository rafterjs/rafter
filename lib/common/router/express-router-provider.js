export default class ExpressRouterProvider {
    constructor(express) {
        this._express = express;
    }

    createInstance() {
        return this._express.Router();
    }
}
