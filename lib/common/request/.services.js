export default {
    getRequestDtoProvider: {
        path: `${__dirname}/get-request-dto-provider`,
        dependencies: [
            'filterObjectToFilterDtoTransformer',
            'sortStringToSortDtoTransformer',
            'paramsObjectToParamsDtoTransformer',
        ]
    },
    filterObjectToFilterDtoTransformer: {
        path: `${__dirname}/mappers/filter-object-to-filter-dto-transformer`,
        dependencies: []
    },
    sortStringToSortDtoTransformer: {
        path: `${__dirname}/mappers/sort-dto-to-query-object-transformer`,
        dependencies: []
    },
    paramsObjectToParamsDtoTransformer: {
        path: `${__dirname}/mappers/params-object-to-params-dto-transformer`,
        dependencies: []
    },
    filterDtoToFilterObjectTransformer: {
        path: `${__dirname}/mappers/filter-dto-to-filter-object-transformer`,
        dependencies: []
    },
    sortDtoToQueryObjectTransformer: {
        path: `${__dirname}/mappers/sort-dto-to-query-object-transformer`,
        dependencies: []
    },
};
