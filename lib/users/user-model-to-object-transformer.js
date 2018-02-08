import TransformerInterface from '../common/mappers/transformer-interface';
import UserModel from './user-schema';
import {FIELDS} from './user-constants';

/**
 * A User mapper to convert database models to responses
 *
 * @constructor
 */
export default class UserModelToObjectTransformer extends TransformerInterface {
    /**
     * @param {UserModel|UserModel[]} source
     * @returns {object|object[]}
     */
    convert(source) {
        if (source instanceof Array) {
            return this._convertArray(source);
        }

        return this._convertSingle(source);
    }

    /**
     * Converts an {@link User} model to a response object.
     *
     * @param {UserModel} source
     * @returns {object}
     * @private
     */
    _convertSingle(source) {
        if (source instanceof UserModel) {
            return {
                [FIELDS.ID]: source.getId(),
                [FIELDS.FIRST_NAME]: source.getFirstName(),
                [FIELDS.LAST_NAME]: source.getLastName(),
                [FIELDS.EMAIL]: source.getEmail(),
            };
        }
    }

    /**
     * Converts an {@link Array} of {@link User} models to an {@link Array} of response objects.
     *
     * @param {UserModel[]} source
     * @returns {object[]}
     * @private
     */
    _convertArray(source) {
        const response = [];

        for (const model of source) {
            response.push(this._convertSingle(model));
        }

        return response;
    }
}
