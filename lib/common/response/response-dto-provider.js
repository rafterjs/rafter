import ResponseDto from './response-dto';
import DataResponseDto from './data-response-dto';
import MetadataResponseDto from './metadata-response-dto';
import PageResponseDto from './page-response-dto';

export default class ResponseDtoProvider {
    /**
     * @param {object|object[]} models
     * @param {string} entityType
     * @param {number} offset
     * @param {number} limit
     * @param {number} total
     * @return {ResponseDto}
     */
    createInstance(models, entityType, offset = 0, limit = 1, total = 1) {
        const pageResponse = new PageResponseDto(offset, limit, total);
        const metadataResponse = new MetadataResponseDto(pageResponse);
        const dataResponse = this._createDataResponseInstance(models, entityType);
        return new ResponseDto(dataResponse, metadataResponse);
    }

    /**
     * @param {object|object[]} models
     * @param {string} entityType
     * @return {DataResponseDto|DataResponseDto[]}
     * @private
     */
    _createDataResponseInstance(models, entityType) {
        let data;

        if (models instanceof Array) {
            data = [];
            for (const model of models) {
                data.push(
                    new DataResponseDto(
                        this._getModelId(model),
                        entityType,
                        model
                    )
                );
            }
        } else {
            data = new DataResponseDto(
                this._getModelId(models),
                entityType,
                models
            );
        }

        return data;
    }

    /**
     * @param {object} source
     * @private
     */
    _getModelId(source) {
        // check if there is an id getter
        if (source.getId instanceof Function) {
            return source.getId();
        }

        // this is a fallback for legacy services, but shouldn't be relied upon. Once we consolidate the legacy
        // controllers into new controller patterns, this should no longer be needed
        return source.id;
    }
}
