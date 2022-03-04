import { IRequest, IResponse } from 'rafter';
import { IJsonController } from './IJsonController';
import { IJsonResponseData } from './IJsonResponse';
import { JsonErrorResponseDto } from './JsonErrorResponseDto';
import { JsonResponseDto } from './JsonResponseDto';
import { JsonRenderer } from './JsonRenderer';

export abstract class JsonController implements IJsonController {
  protected constructor(protected readonly jsonRenderer: JsonRenderer) {}

  public async render<T extends IJsonResponseData>(
    request: IRequest,
    response: IResponse,
    jsonResponseDto: JsonResponseDto<T>,
  ): Promise<void> {
    return this.jsonRenderer.render(request, response, jsonResponseDto);
  }

  public async renderError(
    request: IRequest,
    response: IResponse,
    jsonErrorResponseDto: JsonErrorResponseDto,
  ): Promise<void> {
    return this.jsonRenderer.renderError(request, response, jsonErrorResponseDto);
  }
}
