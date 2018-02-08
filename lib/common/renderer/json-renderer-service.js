import AbstractRendererService from './abstract-renderer-service';

class JsonRendererService extends AbstractRendererService {
    /**
     * @param {TransformerInterface} responseDtoToJsonTransformer
     */
    constructor(responseDtoToJsonTransformer) {
        super();
        this._responseDtoToJsonTransformer = responseDtoToJsonTransformer;
    }

    /**
     * @inheritDoc
     */
    async render(req, res, responseDto) {
        res.json(
            this._responseDtoToJsonTransformer.convert(responseDto)
        );
    }
}

export default JsonRendererService;
