import TransformerInterface from '../../mappers/transformer-interface';
import {SORT_QUALIFIER} from '../../json/json-constants';
import {SORT} from '../request-constants';

class SortDtoToQueryObjectTransformer extends TransformerInterface {
    /**
     * @param {SortDto[]} sorts
     * @return {object}
     */
    convert(sorts = []) {
        const sortBy = {};

        if (sorts instanceof Array) {
            for (const sort of sorts) {
                sortBy[sort.getKey()] = sort.getOrder() === SORT_QUALIFIER.ASCENDING ? SORT.ASCENDING : SORT.DESCENDING;
            }
        }

        return sortBy;
    }
}

export default SortDtoToQueryObjectTransformer;
