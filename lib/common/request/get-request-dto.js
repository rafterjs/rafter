import {OFFSET, SORT, LIMIT} from './request-constants';

export default class GetRequestDto {
    /**
     * @param {FilterDto[]} filters
     * @param {object=} params
     * @param {number=} offset
     * @param {number=} limit
     * @param {SortDto[]=} sortBy
     */
    constructor(
        filters,
        params = {},
        offset = OFFSET,
        limit = LIMIT,
        sortBy = SORT
    ) {
        this._filters = filters;
        this._params = params;
        this._offset = offset;
        this._limit = limit;
        this._sortBy = sortBy;
    }

    /**
     * @returns {FilterDto[]}
     */
    getFilters() {
        return this._filters;
    }

    /**
     * @returns {ParamsDto}
     */
    getParams() {
        return this._params;
    }

    /**
     * @returns {number}
     */
    getLimit() {
        return this._limit;
    }

    /**
     * @returns {number}
     */
    getOffset() {
        return this._offset;
    }

    /**
     * @returns {SortDto[]}
     */
    getSortBy() {
        return this._sortBy;
    }
}
