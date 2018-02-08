import InstantiationError from './../errors/interface/instantiation-error';

export default class AbstractRequestDto {
    constructor() {
        /* istanbul ignore if  */
        if (this.constructor === AbstractRequestDto) {
            throw new InstantiationError();
        }
    }

    /**
     * @param {User} activeUser
     * @return {AbstractRequestDto}
     */
    setActiveUser(activeUser) {
        this._activeUser = activeUser;
        return this;
    }

    /**
     * @returns {User}
     */
    getActiveUser() {
        return this._activeUser;
    }

    /**
     * @param {Marketplace} marketplace
     * @return {AbstractRequestDto}
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
