import InstantiationError from './../errors/interface/instantiation-error';

export default class AbstractResponseDto {
    constructor() {
        /* istanbul ignore if  */
        if (this.constructor === AbstractResponseDto) {
            throw new InstantiationError();
        }
    }

    /**
     * @param {Marketplace} marketplace
     * @return {AbstractResponseDto}
     */
    setMarketplace(marketplace) {
        this._marketplace = marketplace;
        return this;
    }

    /**
     * @returns {Marketplace}
     */
    getMarketplace() {
        return this._marketplace;
    }
}
