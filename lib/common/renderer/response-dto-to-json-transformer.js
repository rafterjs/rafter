import MapperInterface from '../mappers/mapper-interface';

/**
 * A mapper to convert a response dto into a json object
 *
 * @constructor
 */
class ResponseDtoToJsonTransformer extends MapperInterface {
    /**
     * @param {ResponseDto} source
     * @return {object}
     */
    convert(source) {
        return {
            data: this._getData(source.getData()),
            meta: this._getMetadata(source.getMetadata()),
        };
    }

    /**
     * @param {MetadataResponseDto} metadataResponse
     * @return {object}
     * @private
     */
    _getMetadata(metadataResponse) {
        const metadata = {};

        if (metadataResponse) {
            const page = metadataResponse.getPage();
            if (page) {
                return {
                    page: {
                        limit: page.getLimit(),
                        offset: page.getOffset(),
                        total: page.getTotal()
                    }
                };
            }
        }

        return metadata;
    }

    /**
     * @param {DataResponseDto|DataResponseDto[]} data
     * @return {Object|Object[]}
     * @private
     */
    _getData(data) {
        let formattedData;

        if (data instanceof Array) {
            formattedData = [];

            for (const dataObject of data) {
                formattedData.push(this._formatData(dataObject));
            }
        } else {
            formattedData = this._formatData(data);
        }

        return formattedData;
    }

    /**
     * @param {DataResponseDto} data
     * @return {object}
     * @private
     */
    _formatData(data) {
        return {
            id: data.getId(),
            type: data.getType(),
            attributes: data.getAttributes()
        };
    }
}

export default ResponseDtoToJsonTransformer;
