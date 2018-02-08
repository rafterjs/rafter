import UserModel from './user-schema';

export default class UserManager {
    /**
     * @param {MongooseDbDao} dbDao
     */
    constructor(dbDao) {
        this._dbDao = dbDao;
    }

    /**=
     * @param {UserModel} userModel
     * @return {Promise.<UserModel>}
     */
    async create(userModel) {
        return this._dbDao.create(userModel);
    }

    /**=
     * @param {UserModel} userModel
     * @return {Promise.<UserModel>}
     */
    async update(userModel) {
        return this._dbDao.create(userModel);
    }

    /**
     * @param {object} query
     * @param {number} offset
     * @param {number} limit
     * @param {object} sortBy
     * @return {Promise.<UserModel>}
     */
    async findAll(
        query,
        offset,
        limit,
        sortBy
    ) {
        const option = {
            criteria: query,
            offset,
            limit,
            sort: sortBy
        };

        return this._dbDao.findAll(
            UserModel,
            option
        );
    }

}
