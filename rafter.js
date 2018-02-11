import BoxDiAutoLoader from 'box-di-autoloader';
import ConfigAutoloaderService from './lib/utils/config-autoloader-service';
import {Box} from 'box-di';

const RAFTER_AUTOLOADER_DIRECTORY = `${__dirname}/lib`;

export default class Rafter {
    /**
     * @param {string=} appDirectory This is the directory your application is located. Most of the time it
     *     will be 2 directories up from where Rafter is located, but that is not always the case.
     * @param {object=} autoloader The autoloading parameters. You can customize what the names of each of the
     *     autoloaded files should be.
     * @param {Logger=} logger a logging interface eg. winston, console, etc
     */
    constructor({
        appDirectory = `${__dirname}/../../`,
        autoloader = {
            config: `.config.js`,
            routes: `.routes.js`,
            middleware: `.middleware.js`,
            services: `.services.js`,
            preStartHooks: `.pre-start-hooks.js`,
        },
        logger = console
    }) {
        // TODO allow overriding configuration.... not sure how yet.
        // Also inject this dependency otherwise it is difficult to test and swap out.
        this._recursiveConfigLoader = new ConfigAutoloaderService(
            autoloader.config,
            autoloader.services,
            autoloader.middleware,
            autoloader.routes,
            autoloader.preStartHooks,
            logger
        );
        this._appDirectory = appDirectory;
        this._logger = logger;
        this._boxDiAutoLoader;
        this._server;
    }

    async start() {
        try {
            this._boxDiAutoLoader = await this._getAutoloader();
            await this._boxDiAutoLoader.load();

            /**
             * @type {Server}
             */
            this._server = this._boxDiAutoLoader.get('server');
            return this._server.start();
        } catch (error) {
            this._logger.error(error);
            process.exit(1);
        }
    }

    /**
     * @return {Promise<ConfigDto>}
     * @private
     */
    async _getConfig() {
        // load rafter config
        const configDto = await this._recursiveConfigLoader.get(
            RAFTER_AUTOLOADER_DIRECTORY
        );

        // load application config
        if (this._appDirectory) {
            const applicationConfigDto = await this._recursiveConfigLoader.get(
                this._appDirectory
            );

            // merge the application config
            configDto.addConfig(applicationConfigDto.getConfig()).
            addServices(applicationConfigDto.getServices()).
            addMiddleware(applicationConfigDto.getMiddleware()).
            addPreStartHooks(applicationConfigDto.getPreStartHooks()).
            addRoutes(applicationConfigDto.getRoutes());
        }

        return configDto;
    }

    async _getAutoloader() {
        const configDto = await this._getConfig();

        // TODO namespace these DI services

        // add the config to the DI container
        Box.register(`config`, () => configDto.getConfig());

        // add the services to the DI container
        Box.register(`services`, () => configDto.getServices());

        // add the routes to the DI container
        Box.register(`routes`, () => configDto.getRoutes());

        // add the middleware to the DI container
        Box.register(`middleware`, () => configDto.getMiddleware());

        // add the middleware to the DI container
        Box.register(`preStartHooks`, () => configDto.getPreStartHooks());

        return new BoxDiAutoLoader(
            configDto.getServices(),
            Box,
            this._logger
        );
    }

    /**
     * @return {Promise}
     */
    async stop() {
        if (this._server) {
            // TODO empty the service container
            // this._boxDiAutoLoader.reset();
            return this._server.stop();
        }

        throw new Error(`Rafter::stop the server has not been started`);
    }
}
