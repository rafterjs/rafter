import AbstractCollectionResponseDto from '../common/response/abstract-collection-response-dto';

export default class UsersCollectionResponseDto extends AbstractCollectionResponseDto {
    constructor(users = [], offset = 0, limit = 0, total = 0) {
        super(offset, limit, total);
        this._users = users;
    }

    /**
     * @return {UserModel[]|UserModel}
     */
    getUsers() {
        return this._users;
    }

    /**
     * @param {UserModel[]|UserModel} users
     * @return {UsersCollectionResponseDto}
     */
    setUsers(users = []) {
        this._users = users;
        return this;
    }
}
