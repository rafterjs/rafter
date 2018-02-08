class MetadataResponseDto {
    /**
     * @param {PageResponseDto} page
     */
    constructor(page) {
        this._page = page;
    }

    /**
     * @return {PageResponseDto}
     */
    getPage() {
        return this._page;
    }

    /**
     * @param {PageResponseDto} page
     * @return {MetadataResponseDto}
     */
    setPage(page) {
        this._page = page;
        return this;
    }
}

export default MetadataResponseDto;
