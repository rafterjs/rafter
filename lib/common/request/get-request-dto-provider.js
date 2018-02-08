import get from 'lodash.get';
import {FILTER, PAGE_LIMIT, PAGE_OFFSET, SORT} from './../../common/json/json-constants';
import GetRequestDto from './get-request-dto';

export default class GetRequestDtoProvider {
    /**
     * @param {FilterObjectToFilterDtoTransformer} filterObjectToFilterDtoTransformer
     * @param {SortStringToSortDtoTransformer} sortStringToSortDtoTransformer
     * @param {ParamsObjectToParamsDtoTransformer} paramsObjectToParamsDtoTransformer
     */
    constructor(
        filterObjectToFilterDtoTransformer,
        sortStringToSortDtoTransformer,
        paramsObjectToParamsDtoTransformer,
    ) {
        this._filterObjectToFilterDtoTransformer = filterObjectToFilterDtoTransformer;
        this._sortStringToSortDtoTransformer = sortStringToSortDtoTransformer;
        this._paramsObjectToParamsDtoTransformer = paramsObjectToParamsDtoTransformer;
    }

    /**
     * @param {express.Request} req
     * @return {GetRequestDto}
     */
    createInstance(req) {
        /**
         * @type {object} body
         * @type {object} params
         * @type {object} query
         */
        const {params = {}, query = {}} = req;

        // http://expressjs.com/en/4x/api.html#req.query
        const filters = get(query, FILTER);
        const limit = get(query, PAGE_LIMIT);
        const offset = get(query, PAGE_OFFSET);
        const sortBy = get(query, SORT);

        return new GetRequestDto(
            this._filterObjectToFilterDtoTransformer.convert(filters),
            this._paramsObjectToParamsDtoTransformer.convert(params),
            offset,
            limit,
            this._sortStringToSortDtoTransformer.convert(sortBy)
        );
    }
}
