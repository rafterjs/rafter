class ResponseDto {
    /**
     *
     * @param {DataResponseDto|DataResponseDto[]} data
     * @param {MetadataResponseDto} metadata
     */
    constructor(data, metadata) {
        this._data = data;
        this._metadata = metadata;
    }

    /**
     * @returns {DataResponseDto|DataResponseDto[]}
     */
    getData() {
        return this._data;
    }

    /**
     * @returns {MetadataResponseDto}
     */
    getMetadata() {
        return this._metadata;
    }
}

export default ResponseDto;
