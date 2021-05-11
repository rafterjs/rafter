import { IJsonResponse, IJsonResponseData, IJsonResponseTransformer, IRequest, JsonResponseDto } from '@rafterjs/api';

/**
 * This is an example of how to override default services within @rafterjs/api. As long as it is within your
 * autoloaded app, and has the same name as the rafter service, it will override it. You can see a list of services
 * that can be overridden here:
 */
export class JsonResponseTransformer implements IJsonResponseTransformer {
  public convert<T extends IJsonResponseData>(
    request: IRequest,
    jsonResponseDto: JsonResponseDto<T>,
  ): IJsonResponse<T> {
    return {
      data: jsonResponseDto.data,
    } as IJsonResponse<T>;
  }
}

export default JsonResponseTransformer;
