import BoxDiAutoLoader from 'box-di-autoloader';
import defaultConfig from './config/.config';
import ConfigAutoloaderService from './lib/utils/config-autoloader-service';
import {Box} from 'box-di';

export default class Rafter {
    constructor(configFile, logger) {
        // TODO allow overriding configuration
        this._configFile = configFile;
        this._logger = logger;
        this._boxDiAutoLoader;
        this._server;
    }

    async start() {
        try {
            const recursiveConfigLoader = new ConfigAutoloaderService();

            // load framework config
            const frameworkConfigDto = await recursiveConfigLoader.get(
                defaultConfig.autoloader.directory
            );

            // add the config to the DI container
            Box.register(`config`, () => frameworkConfigDto.getConfig());

            // add the services to the DI container
            Box.register(`services`, () => frameworkConfigDto.getServices());

            // add the routes to the DI container
            Box.register(`routes`, () => frameworkConfigDto.getRoutes());

            // add the middleware to the DI container
            Box.register(`middleware`, () => frameworkConfigDto.getMiddleware());

            // load application config
            this._boxDiAutoLoader = new BoxDiAutoLoader(
                frameworkConfigDto.getServices(),
                Box,
                this._logger
            );

            await this._boxDiAutoLoader.load();

            /**
             * @type {ExpressServer}
             */
            this._server = this._boxDiAutoLoader.get('server');
            return this._server.start();
        } catch (error) {
            console.error(error);
            process.exit(1);
        }
    }

    async stop() {
        if (this._server) {
            return this._server.stop();
        }

        throw new Error(`Rafter::stop the server has not been started`);
    }
}
