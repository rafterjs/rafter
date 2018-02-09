/**
 * A generic logger class. This takes a logger, which could even be console if needed.
 */
export default class Logger {
    /**
     * @param {object} loggingService
     */
    constructor(loggingService) {
        this._loggingService = loggingService;
    }

    /**
     * @param args
     */
    log(...args) {
        if (this._loggingService.log instanceof Function) {
            this._loggingService.log.apply(this._loggingService, args);
        }
    }

    /**
     * @param args
     */
    debug(...args) {
        if (this._loggingService.debug instanceof Function) {
            this._loggingService.debug.apply(this._loggingService, args);
        }
    }

    /**
     * @param args
     */
    info(...args) {
        if (this._loggingService.info instanceof Function) {
            this._loggingService.info.apply(this._loggingService, args);
        }
    }

    /**
     * @param args
     */
    error(...args) {
        if (this._loggingService.error instanceof Function) {
            this._loggingService.error.apply(this._loggingService, args);
        }
    }

    /**
     * @param args
     */
    warn(...args) {
        if (this._loggingService.warn instanceof Function) {
            this._loggingService.warn.apply(this._loggingService, args);
        }
    }
}
