/**
 * A config dto which holds information about services, middleware, routes and misc config. This is used primarily for
 * the autoloaders and to be put into the DI container for later use by services.
 */
export default class ConfigDto {
    constructor() {
        this._config = {};
        this._services = {};
        this._middleware = {};
        this._routes = [];
        this._preStartHooks = [];
    }

    /**
     * @return {object}
     */
    getConfig() {
        return this._config;
    }

    /**
     * @param {object} config
     * @return {ConfigDto}
     */
    addConfig(config) {
        this._config = {
            ...this._config,
            ...config,
        };
        return this;
    }

    /**
     * @return {Function[]}
     */
    getPreStartHooks() {
        return this._preStartHooks;
    }

    /**
     * @param {Function[]} preStartHooks
     * @return {ConfigDto}
     */
    addPreStartHooks(preStartHooks) {
        this._preStartHooks = [
            ...this._preStartHooks,
            ...preStartHooks,
        ];
        return this;
    }

    /**
     * @return {object}
     */
    getServices() {
        return this._services;
    }

    /**
     * @param {object} services
     * @return {ConfigDto}
     */
    addServices(services) {
        this._services = {
            ...this._services,
            ...services,
        };
        return this;
    }

    /**
     * @return {object}
     */
    getMiddleware() {
        return this._middleware;
    }

    /**
     * @param {object} middleware
     * @return {ConfigDto}
     */
    addMiddleware(middleware) {
        this._middleware = {
            ...this._middleware,
            ...middleware,
        };
        return this;
    }

    /**
     * @return {object}
     */
    getRoutes() {
        return this._routes;
    }

    /**
     * @param {object[]} routes
     * @return {ConfigDto}
     */
    addRoutes(routes) {
        this._routes = [
            ...this._routes,
            ...routes,
        ];
        return this;
    }
}
