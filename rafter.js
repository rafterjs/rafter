import BoxDiAutoLoader from 'box-di-autoloader';
import rafterConfig from './config/.config';
import ConfigAutoloaderService from './lib/utils/config-autoloader-service';
import {Box} from 'box-di';

export default class Rafter {
    /**
     * @param {string=} applicationDirectory This is the directory your application is located. Most of the time it
     *     will be 2 directories up from where Rafter is located, but that is not always the case.
     * @param {Logger=} logger
     */
    constructor(applicationDirectory = `${__dirname}/../../`, logger = console) {
        // TODO allow overriding configuration
        this._recursiveConfigLoader = new ConfigAutoloaderService();
        this._applicationDirectory = applicationDirectory;
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
            rafterConfig.autoloader.directory
        );

        // load application config
        if (this._applicationDirectory) {
            const applicationConfigDto = await this._recursiveConfigLoader.get(
                this._applicationDirectory
            );
            // merge the application config
            configDto.addConfig(applicationConfigDto.getConfig()).
            addServices(applicationConfigDto.getServices()).
            addMiddleware(applicationConfigDto.getMiddleware()).
            addRoutes(applicationConfigDto.getRoutes());
        }

        return configDto;
    }

    async _getAutoloader() {
        const configDto = await this._getConfig();

        // add the config to the DI container
        Box.register(`config`, () => configDto.getConfig());

        // add the services to the DI container
        Box.register(`services`, () => configDto.getServices());

        // add the routes to the DI container
        Box.register(`routes`, () => configDto.getRoutes());

        // add the middleware to the DI container
        Box.register(`middleware`, () => configDto.getMiddleware());

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
