import {GET} from './route-method-constants';
import RouteDto from './route-dto';

/**
 * A config to route mapper.
 *
 * @param {Box} diContainer
 * @return {ConfigToRouteDtoTransformer}
 */
export default (diContainer) => {
    /**
     * @namespace ConfigToRouteDtoTransformer
     */
    const ConfigToRouteDtoTransformer = {};

    /**
     * @param {object} source
     * @return {RouteDto[]}
     */
    ConfigToRouteDtoTransformer.convert = (source) => {
        const routes = [];
        for (const config of source) {
            routes.push(
                convertSingle(config)
            );
        }

        return routes;
    };

    /**
     * @param {string=} method
     * @param {string} endpoint
     * @param {string} controller
     * @param {string} action
     * @return {RouteDto}
     * @private
     */
    function convertSingle({method = GET, endpoint, controller, action}) {
        return RouteDto(
            method,
            endpoint,
            getController(
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
    function getController(controllerName, action) {
        const controller = diContainer.get(controllerName);
        if (!controller[action]) {
            throw new Error(`Could not register the controller ${controllerName} with the action ${action}`);
        }

        return controller[action].bind(controller);
    }

    return Object.freeze(ConfigToRouteDtoTransformer);
}
