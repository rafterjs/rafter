class PageResponseDto {
    /**
     * @param {number} offset
     * @param {number} limit
     * @param {number} total
     */
    constructor(offset = 0, limit = 1, total = 1) {
        this._limit = limit;
        this._offset = offset;
        this._total = total;
    }

    /**
     * @return {Number}
     */
    getLimit() {
        return this._limit;
    }

    /**
     * @param {Number} limit
     * @return {PageResponseDto}
     */
    setLimit(limit) {
        this._limit = limit;
        return this;
    }

    /**
     * @return {Number}
     */
    getOffset() {
        return this._offset;
    }

    /**
     * @param {Number} offset
     * @return {PageResponseDto}
     */
    setOffset(offset) {
        this._offset = offset;
        return this;
    }

    /**
     * @return {Number}
     */
    getTotal() {
        return this._total;
    }

    /**
     * @param {Number} total
     * @return {PageResponseDto}
     */
    setTotal(total) {
        this._total = total;
        return this;
    }
}

export default PageResponseDto;
