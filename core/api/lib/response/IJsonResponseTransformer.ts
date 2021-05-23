import { IRequest } from 'rafter';
import { IJsonResponse, IJsonResponseData } from './IJsonResponse';
import { JsonResponseDto } from './JsonResponseDto';

export interface IJsonResponseTransformer {
  convert<T extends IJsonResponseData>(request: IRequest, jsonResponseDto: JsonResponseDto<T>): IJsonResponse<T>;
}
