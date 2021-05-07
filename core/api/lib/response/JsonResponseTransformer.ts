import { IRequest, HttpError } from 'rafter';
import { UrlHelper } from '../utils';
import { HttpContextHelper } from '../utils/HttpContextHelper';

import { IJsonError, IJsonErrorResponse } from './IJsonErrorResponse';
import { IJsonResponse, IJsonResponseData, IJsonResponseLinks, IJsonResponseMeta } from './IJsonResponse';
import { JsonErrorResponseDto } from './JsonErrorResponseDto';
import { JsonResponseDto } from './JsonResponseDto';

export class JsonResponseTransformer {
  constructor(private readonly httpContextHelper: HttpContextHelper, private readonly urlHelper: UrlHelper) {}

  public convert<T extends IJsonResponseData>(
    request: IRequest,
    jsonResponseDto: JsonResponseDto<T>,
  ): IJsonResponse<T> {
    return {
      transactionId: this.httpContextHelper.getTransactionId(),
      message: jsonResponseDto.message,
      data: jsonResponseDto.data,
      links: this.convertLinks(request),
      meta: this.convertMeta(jsonResponseDto.meta),
    } as IJsonResponse<T>;
  }

  private convertMeta(meta?: IJsonResponseMeta): IJsonResponseMeta | undefined {
    if (meta) {
      return {
        totalPages: meta.totalPages,
        totalRecords: meta.totalRecords,
      };
    }
  }

  private convertLinks(request: IRequest): IJsonResponseLinks {
    return {
      self: this.urlHelper.getSelf(request),
    };
  }

  public convertError(request: IRequest, jsonErrorResponseDto: JsonErrorResponseDto): IJsonErrorResponse {
    const errors = jsonErrorResponseDto.errors.map(this.formatError.bind(this));

    return {
      transactionId: this.httpContextHelper.getTransactionId(),
      errors,
    } as IJsonErrorResponse;
  }

  private formatError(error: HttpError): IJsonError {
    return {
      code: error.status,
      title: error.name,
      detail: error.message || '',
    };
  }
}

export default JsonResponseTransformer;
