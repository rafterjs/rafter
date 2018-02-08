export default class ParamsDto {
    /**
     * @param {string} id
     */
    constructor(
        id,
    ) {
        this._id = id;
    }

    /**
     * @returns {string}
     */
    getId() {
        return this._id;
    }
}
