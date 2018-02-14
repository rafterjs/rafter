/**
 * A config dto which holds information about services, middleware, routes and misc config. This is used primarily for
 * the autoloaders and to be put into the DI container for later use by services.
 *
 * @return {ConfigDto}
 */
export default () => {
    /**
     * @namespace ConfigDto
     */
    const ConfigDto = {};

    let config = {};
    let services = {};
    let middleware = {};
    let routes = [];
    let preStartHooks = [];

    /**
     * @return {object}
     */
    ConfigDto.getConfig = () => {
        return config;
    };

    /**
     * @param {object} config
     * @return {ConfigDto}
     */
    ConfigDto.addConfig = (newConfig) => {
        config = {
            ...config,
            ...newConfig,
        };
        return ConfigDto;
    };

    /**
     * @return {Function[]}
     */
    ConfigDto.getPreStartHooks = () => {
        return preStartHooks;
    };

    /**
     * @param {Function[]} preStartHooks
     * @return {ConfigDto}
     */
    ConfigDto.addPreStartHooks = (newPreStartHooks) => {
        preStartHooks = [
            ...preStartHooks,
            ...newPreStartHooks,
        ];
        return ConfigDto;
    };

    /**
     * @return {object}
     */
    ConfigDto.getServices = () => {
        return services;
    };

    /**
     * @param {object} services
     * @return {ConfigDto}
     */
    ConfigDto.addServices = (newServices) => {
        services = {
            ...services,
            ...newServices,
        };
        return ConfigDto;
    };

    /**
     * @return {object}
     */
    ConfigDto.getMiddleware = () => {
        return middleware;
    };

    /**
     * @param {object} middleware
     * @return {ConfigDto}
     */
    ConfigDto.addMiddleware = (newMiddleware) => {
        middleware = {
            ...middleware,
            ...newMiddleware,
        };
        return ConfigDto;
    };

    /**
     * @return {object}
     */
    ConfigDto.getRoutes = () => {
        return routes;
    };

    /**
     * @param {object[]} routes
     * @return {ConfigDto}
     */
    ConfigDto.addRoutes = (newRoutes = []) => {
        routes = [
            ...routes,
            ...newRoutes,
        ];
        return ConfigDto;
    };

    return Object.freeze(ConfigDto);
}
