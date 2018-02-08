import TransformerInterface from '../../mappers/transformer-interface';
import ParamsDto from '../params-dto';

class ParamsObjectToParamsDtoTransformer extends TransformerInterface {
    /**
     * @param {object} params
     * @return {ParamsDto}
     */
    convert(params = {}) {
        return new ParamsDto(params.id);
    }
}

export default ParamsObjectToParamsDtoTransformer;
