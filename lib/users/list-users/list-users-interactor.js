import UsersCollectionResponseDto from '../users-collection-response-dto';

export default class ListUsersInteractor {
    /**
     * @param {UserManager} userManager
     * @param {FilterDtoToFilterObjectTransformer} filterDtoToFilterObjectTransformer
     * @param {SortDtoToQueryObjectTransformer} sortDtoToQueryObjectTransformer
     */
    constructor(
        userManager,
        filterDtoToFilterObjectTransformer,
        sortDtoToQueryObjectTransformer,
    ) {
        this._userManager = userManager;
        this._filterDtoToFilterObjectTransformer = filterDtoToFilterObjectTransformer;
        this._sortDtoToQueryObjectTransformer = sortDtoToQueryObjectTransformer;
    }

    /**
     * @param {GetRequestDto} getRequestDto
     * @returns {Promise.<UsersCollectionResponseDto>}
     */
    async listUsers(getRequestDto) {
        const limit = getRequestDto.getLimit();
        const offset = getRequestDto.getOffset();
        const filters = getRequestDto.getFilters();
        const sort = getRequestDto.getSortBy();

        const users = await this._userManager.findAll(
            this._filterDtoToFilterObjectTransformer.convert(filters),
            offset,
            limit,
            this._sortDtoToQueryObjectTransformer.convert(sort)
        );

        const allUsers = await this._userManager.findAll(
            this._filterDtoToFilterObjectTransformer.convert(filters),
            0,
            0,
            0,
            true,
            false
        );

        return new UsersCollectionResponseDto(users, offset, limit, allUsers.length);
    }
}
