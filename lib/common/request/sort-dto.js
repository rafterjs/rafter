import {SORT_QUALIFIER} from '../json/json-constants';

export default class SortDto {
    /**
     * @param {string} key
     * @param {object} order
     */
    constructor(
        key,
        order = SORT_QUALIFIER.ASCENDING,
    ) {
        this._key = key;
        this._order = order;
    }

    /**
     * @returns {string}
     */
    getKey() {
        return this._key;
    }

    /**
     * @returns {object}
     */
    getOrder() {
        return this._order;
    }
}
