class DataResponseDto {
    /**
     * @param {string} id
     * @param {string} type
     * @param {object} attributes
     */
    constructor(id, type, attributes) {
        this._id = id;
        this._type = type;
        this._attributes = attributes;
    }

    /**
     * @return {string}
     */
    getId() {
        return this._id;
    }

    /**
     * @param {string} id
     * @return {DataResponseDto}
     */
    setId(id) {
        this._id = id;
        return this;
    }

    /**
     * @return {string}
     */
    getType() {
        return this._type;
    }

    /**
     * @param {string} type
     * @return {DataResponseDto}
     */
    setType(type) {
        this._type = type;
        return this;
    }

    /**
     * @return {object}
     */
    getAttributes() {
        return this._attributes;
    }

    /**
     * @param {object} attributes
     * @return {DataResponseDto}
     */
    setAttributes(attributes) {
        this._attributes = attributes;
        return this;
    }
}

export default DataResponseDto;
