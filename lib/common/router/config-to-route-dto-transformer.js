import TransformerInterface from '../mappers/transformer-interface';
import {GET} from './route-method-constants';
import RouteDto from './route-dto';

/**
 * A config to route mapper.
 */
export default class ConfigToRouteDtoTransformer extends TransformerInterface {
    constructor(diContainer) {
        super();
        this._diContainer = diContainer;
    }

    /**
     * @param {object} source
     * @return {RouteDto[]}
     */
    convert(source) {
        const routes = [];
        for (const config of source) {
            routes.push(
                this._convertSingle(config)
            );
        }

        return routes;
    }

    /**
     * @param {string=} method
     * @param {string} endpoint
     * @param {string} controller
     * @param {string} action
     * @return {RouteDto}
     * @private
     */
    _convertSingle({method = GET, endpoint, controller, action}) {
        return new RouteDto(
            method,
            endpoint,
            this._getController(
                controller,
                action
            )
        );
    }

    /**
     *
     * @param {String=} controllerName
     * @param {String=} action
     * @returns {Function}
     * @private
     */
    _getController(controllerName, action) {
        const controller = this._diContainer.get(controllerName);
        if (!controller[action]) {
            throw new Error(`Could not register the controller ${controllerName} with the action ${action}`);
        }

        return controller[action].bind(controller);
    }
}
