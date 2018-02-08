class LinkResponseDto {
    /**
     * @param {String} self
     * @param {String=} related
     */
    constructor(self, related) {
        this._self = self;
        this._related = related;
    }

    /**
     * @return {String}
     */
    getSelf() {
        return this._self;
    }

    /**
     * @param {String} self
     * @return {LinkResponseDto}
     */
    setSelf(self) {
        this._self = self;
        return this;
    }

    /**
     * @return {String}
     */
    getRelated() {
        return this._related;
    }

    /**
     * @param {String} related
     * @return {LinkResponseDto}
     */
    setRelated(related) {
        this._related = related;
        return this;
    }
}

export default LinkResponseDto;
