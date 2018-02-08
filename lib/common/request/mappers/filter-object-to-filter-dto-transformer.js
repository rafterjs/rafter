import TransformerInterface from '../../mappers/transformer-interface';
import FilterDto from '../filter-dto';

class FilterObjectToFilterDtoTransformer extends TransformerInterface {
    /**
     * @param {object} queries
     * @return {FilterDto[]}
     */
    convert(queries = {}) {
        const filters = [];

        for (const [key, {value, operator}] of Object.entries(queries)) {
            filters.push(
                new FilterDto(
                    key,
                    value,
                    operator
                )
            );
        }

        return filters;
    }
}

export default FilterObjectToFilterDtoTransformer;
