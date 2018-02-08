import mongoose from 'mongoose';

export default class MongooseDbDao {
    /**
     * @param {string} connectionUrl
     */
    constructor(connectionUrl) {
        this._connectionUrl = connectionUrl;
    }

    /**
     * @return {Promise.<object>}
     */
    async connect() {
        return mongoose.connect(
            this._connectionUrl
        );
    }

    /**
     * @param {Model.schema} model
     * @return {Promise.<Model.schema>}
     */
    async create(model) {
        return model.save();
    }

    /**
     * @param {Model.schema} model
     * @return {Promise.<Model.schema>}
     */
    async update(model) {
        return model.save();
    }

    /**
     * @param {object} query
     * @param {Model.schema} model
     * @param {object} data
     * @return {Promise.<Model.schema>}
     */
    async upsert(query, model, data) {
        // ensure the data doesn't contain an immutable id
        delete data._id;
        return model.findOneAndUpdate(query, data, {upsert: true});
    }

    /**
     * @param {Model.schema} Schema
     * @param {object} options
     * @return {Promise.<Model.schema>}
     */
    async findAll(Schema, options) {
        return Schema.find(options.criteria);
    }

    /**
     * @param {Model.schema} Schema
     * @param {object} options
     * @return {Promise.<Model.schema>}
     */
    async findOne(Schema, options) {
        return Schema.findOne(options);
    }
}
