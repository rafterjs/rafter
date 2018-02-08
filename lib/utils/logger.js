export default class Logger {
    constructor(winston) {
        this._winston = winston;
    }

    /**
     * @param args
     */
    log(...args) {
        this._winston.log.apply(this._winston, args);
    }

    /**
     * @param args
     */
    debug(...args) {
        this._winston.debug.apply(this._winston, args);
    }

    /**
     * @param args
     */
    info(...args) {
        this._winston.info.apply(this._winston, args);
    }

    /**
     * @param args
     */
    error(...args) {
        this._winston.error.apply(this._winston, args);
    }

    /**
     * @param args
     */
    warn(...args) {
        this._winston.warn.apply(this._winston, args);
    }
}
