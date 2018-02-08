import TransformerInterface from '../common/mappers/transformer-interface';
import {ENTITY_TYPES} from './user-constants';

export default class UsersCollectionResponseDtoToResponseDtoTransformer extends TransformerInterface {
    /**
     * @param {TransformerInterface} userModelToObjectTransformer
     * @param {ResponseDtoProvider} responseDtoProvider
     */
    constructor(userModelToObjectTransformer, responseDtoProvider) {
        super();
        this._userModelToObjectTransformer = userModelToObjectTransformer;
        this._responseDtoProvider = responseDtoProvider;
    }

    /**
     * @param {UsersCollectionResponseDto} source
     * @return {ResponseDto}
     */
    convert(source) {
        const users = source.getUsers();
        const offset = source.getOffset();
        const limit = source.getLimit();
        const total = source.getTotal();

        // map users to a user object
        const userObjects = this._userModelToObjectTransformer.convert(users);

        // map to a response dto
        return this._responseDtoProvider.createInstance(
            userObjects,
            ENTITY_TYPES.USER,
            offset,
            limit,
            total
        );
    }
}
