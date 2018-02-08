export default class AbstractCollectionResponseDto {
    constructor(offset = 0, limit = 0, total = 0) {
        this._offset = offset;
        this._limit = limit;
        this._total = total;
    }

    /**
     * @return {number}
     */
    getOffset() {
        return this._offset;
    }

    /**
     * @return {number}
     */
    getLimit() {
        return this._limit;
    }

    /**
     * @return {number}
     */
    getTotal() {
        return this._total;
    }
}
