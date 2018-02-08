import TransformerInterface from '../../mappers/transformer-interface';

class FilterDtoToFilterObjectTransformer extends TransformerInterface {
    /**
     * @param {FilterDto[]} filters
     * @return {object}
     */
    convert(filters = []) {
        let queries = {};

        if (filters instanceof Array) {
            for (const filter of filters) {
                const query = {};
                if (filter.getOperator()) {
                    query[filter.getKey()] = {
                        [filter.getOperator()]: filter.getValue()
                    };
                } else {
                    query[filter.getKey()] = filter.getValue();
                }

                queries = {
                    ...queries,
                    ...query,
                };
            }
        }

        return queries;
    }
}

export default FilterDtoToFilterObjectTransformer;
