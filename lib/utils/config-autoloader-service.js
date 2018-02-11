import fs from 'fs';
import {promisify} from 'util';
import ConfigDto from './config-dto';

const readDirectory = promisify(fs.readdir);
const stats = promisify(fs.stat);
const DEFAULT_FILENAMES = {
    CONFIG: `.config.js`,
    SERVICES: `.services.js`,
    MIDDLEWARE: `.middleware.js`,
    ROUTES: `.routes.js`,
    PRE_START_HOOKS: `.pre-start-hooks.js`,
};
const IGNORE_DIRECTORIES = [
    `node_modules`
];

/**
 * A service that autoloads all the config from dotfiles in the project
 */
export default class ConfigAutoloaderService {
    /**
     * @param {string=} configFileName
     * @param {string=} servicesFileName
     * @param {string=} middlewareFileName
     * @param {string=} routesFileName
     * @param {string=} preStartHooksFileName
     * @param {Logger=} logger
     */
    constructor(
        configFileName = DEFAULT_FILENAMES.CONFIG,
        servicesFileName = DEFAULT_FILENAMES.SERVICES,
        middlewareFileName = DEFAULT_FILENAMES.MIDDLEWARE,
        routesFileName = DEFAULT_FILENAMES.ROUTES,
        preStartHooksFileName = DEFAULT_FILENAMES.PRE_START_HOOKS,
        logger = console
    ) {
        this._configFileName = configFileName;
        this._servicesFileName = servicesFileName;
        this._middlewareFileName = middlewareFileName;
        this._routesFileName = routesFileName;
        this._preStartHooksFileName = preStartHooksFileName;

        this._allowedFileNames = [
            this._configFileName,
            this._servicesFileName,
            this._middlewareFileName,
            this._routesFileName,
            this._preStartHooksFileName,
        ];

        this._logger = logger;
    }

    /**
     * @param {string} directory
     * @return {Promise<ConfigDto>}
     */
    async get(directory) {
        const configDto = new ConfigDto();

        const files = await readDirectory(directory);
        for (const fileName of files) {
            const pathname = `${directory}/${fileName}`;
            this._logger.debug(`RecursiveConfigLoader::get checking path ${pathname}`, fileName, fileName);

            if (this._allowedFileNames.includes(fileName)) {
                try {
                    const fileConfig = require(pathname);
                    this._updateConfig(configDto, fileConfig.default || fileConfig, fileName);
                } catch (error) {
                    this._logger.error(`RecursiveConfigLoader::get Failed to load ${pathname}`);
                }
            } else if (await this._isDirectory(pathname) && !IGNORE_DIRECTORIES.includes(pathname)) {
                const foundConfigDto = await this.get(pathname);

                // append the config to the current one
                configDto.addConfig(foundConfigDto.getConfig()).
                addMiddleware(foundConfigDto.getMiddleware()).
                addServices(foundConfigDto.getServices()).
                addPreStartHooks(foundConfigDto.getPreStartHooks()).
                addRoutes(foundConfigDto.getRoutes());
            }
        }

        return configDto;
    }

    /**
     * @param {ConfigDto} configDto
     * @param {object} config
     * @param {string} fileName
     * @private
     */
    _updateConfig(configDto, config, fileName) {
        switch (fileName) {
            case this._configFileName:
                configDto.addConfig(config);
                break;
            case this._servicesFileName:
                configDto.addServices(config);
                break;
            case this._middlewareFileName:
                configDto.addMiddleware(config);
                break;
            case this._routesFileName:
                configDto.addRoutes(config);
                break;
            case this._preStartHooksFileName:
                configDto.addPreStartHooks(config);
                break;
        }
    }

    /**
     * @param {string} filePath
     * @return {Promise<boolean>}
     * @private
     */
    async _isDirectory(filePath) {
        const fileStats = await stats(filePath);
        return fileStats.isDirectory();
    }
}