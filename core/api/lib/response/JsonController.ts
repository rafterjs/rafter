import { IRequest, IResponse } from 'rafter';
import { IJsonController } from './IJsonController';
import { IJsonResponseData } from './IJsonResponse';
import { JsonErrorResponseDto } from './JsonErrorResponseDto';
import { JsonResponseDto } from './JsonResponseDto';
import { JsonResponseTransformer } from './JsonResponseTransformer';

export abstract class JsonController implements IJsonController {
  protected constructor(protected readonly jsonResponseTransformer: JsonResponseTransformer) {}

  public async render<T extends IJsonResponseData>(
    request: IRequest,
    response: IResponse,
    jsonResponseDto: JsonResponseDto<T>,
  ): Promise<void> {
    response.status(jsonResponseDto.status).json(this.jsonResponseTransformer.convert(request, jsonResponseDto));
  }

  public async renderError(
    request: IRequest,
    response: IResponse,
    jsonErrorResponseDto: JsonErrorResponseDto,
  ): Promise<void> {
    response
      .status(jsonErrorResponseDto.status)
      .json(this.jsonResponseTransformer.convertError(request, jsonErrorResponseDto));
  }
}
